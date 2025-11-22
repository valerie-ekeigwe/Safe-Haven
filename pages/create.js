import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { X, MapPin, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreatePost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    category: 'safety',
    title: '',
    description: '',
    urgency: 'low',
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'safety', label: 'Safety Issue', icon: '🚨', color: 'bg-red-500' },
    { id: 'lost-pet', label: 'Lost Pet', icon: '🐕', color: 'bg-blue-500' },
    { id: 'event', label: 'Community Event', icon: '🎉', color: 'bg-green-500' },
    { id: 'question', label: 'Question', icon: '❓', color: 'bg-amber-500' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿', color: 'bg-purple-500' },
    { id: 'other', label: 'Other', icon: '📋', color: 'bg-stone-500' },
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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error('Please add a description');
      return;
    }

    setLoading(true);

    // Simulate saving (in production, this would save to Firebase)
    setTimeout(() => {
      toast.success('Post created successfully!');
      setLoading(false);
      router.push('/feed');
    }, 1500);
  };

  const handleCancel = () => {
    router.push('/feed');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-stone-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-stone-900 mb-2">Create Post</h1>
            <p className="text-stone-600">Share updates with your neighborhood community</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-stone-700 mb-3">
                What are you posting about? *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: category.id })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === category.id
                        ? 'border-stone-900 bg-stone-900 text-white shadow-lg'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title (Optional) */}
            <div className="card p-6">
              <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-2">
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
            <div className="card p-6">
              <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="input resize-none"
                placeholder="What's happening in your neighborhood?"
              />
              <p className="text-xs text-stone-500 mt-2">
                Be specific and clear. Include relevant details like time, location, and any important information.
              </p>
            </div>

            {/* Images */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Add Photos (optional, max 4)
              </label>
              
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-stone-100">
                      <img
                        src={image.preview}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/80 text-white hover:bg-stone-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {images.length < 4 && (
                <label className="btn btn-secondary w-full cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  Add Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Urgency Level */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-stone-700 mb-3">
                Urgency Level *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {urgencyLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, urgency: level.id })}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      formData.urgency === level.id
                        ? 'bg-stone-900 text-white'
                        : `bg-white border border-stone-200 ${level.color} hover:bg-stone-50`
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Info */}
            <div className="card p-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium text-amber-900 mb-1">Location</h3>
                  <p className="text-sm text-amber-700">
                    Your post will be visible to neighbors in your area: <strong>Downtown</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 sticky bottom-0 bg-stone-50 py-4 border-t border-stone-200">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Post to Community'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
