import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { createPost } from '../lib/db';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { X, Image as ImageIcon, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { compressImage, getCurrentPosition } from '../lib/utils';

export default function CreatePost({ onClose, onPostCreated }) {
  const { user, userData } = useAuth();
  const [formData, setFormData] = useState({
    category: 'safety',
    title: '',
    description: '',
    urgency: 'low',
  });
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    { id: 'safety', label: 'Safety Issue' },
    { id: 'lost-pet', label: 'Lost Pet' },
    { id: 'event', label: 'Event' },
    { id: 'question', label: 'Question' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'other', label: 'Other' },
  ];

  const urgencyLevels = [
    { id: 'low', label: 'Low', color: 'text-green-600' },
    { id: 'medium', label: 'Medium', color: 'text-amber-600' },
    { id: 'high', label: 'High', color: 'text-orange-600' },
    { id: 'emergency', label: 'Emergency', color: 'text-red-600' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    const newImages = [];
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max 5MB per image.`);
        continue;
      }
      newImages.push(file);
    }

    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const getLocation = async () => {
    try {
      setGettingLocation(true);
      const position = await getCurrentPosition();
      setLocation(position);
      toast.success('Location added');
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error('Could not get your location');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast.error('Please add a description');
      return;
    }

    setLoading(true);

    try {
      // Upload images
      const imageUrls = [];
      for (const image of images) {
        const compressed = await compressImage(image);
        const imageRef = ref(
          storage,
          `posts/${user.uid}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        );
        await uploadBytes(imageRef, compressed);
        const url = await getDownloadURL(imageRef);
        imageUrls.push(url);
      }

      // Create post
      await createPost({
        ...formData,
        userId: user.uid,
        authorName: userData?.name || 'Anonymous',
        authorPhoto: userData?.photoURL || null,
        neighborhood: userData?.neighborhood || 'Unknown',
        images: imageUrls,
        location: location || null,
        verified: userData?.verified || false,
      });

      toast.success('Post created successfully!');
      onPostCreated();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-hover w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-stone-900">Create post</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.id })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formData.category === category.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title (optional) */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1.5">
              Title (optional)
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="Give your post a title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1.5">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="input resize-none"
              placeholder="What's happening in your neighborhood?"
            />
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Urgency level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {urgencyLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: level.id })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    formData.urgency === level.id
                      ? 'bg-stone-900 text-white'
                      : `bg-stone-100 ${level.color} hover:bg-stone-200`
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Images (optional, max 4)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <div className="space-y-3">
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-stone-100">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-stone-900/80 text-white hover:bg-stone-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {images.length < 4 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-secondary w-full"
                >
                  <ImageIcon className="w-4 h-4" />
                  Add images
                </button>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <button
              type="button"
              onClick={getLocation}
              disabled={gettingLocation || location}
              className={`btn w-full ${location ? 'btn-secondary' : 'btn-ghost'}`}
            >
              {gettingLocation ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting location...
                </>
              ) : location ? (
                <>
                  <MapPin className="w-4 h-4" />
                  Location added
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  Add location
                </>
              )}
            </button>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                'Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
