import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { formatRelativeTime, formatDistance, getCategoryColor, getCategoryLabel } from '../lib/utils';
import { MapPin, MessageCircle, ThumbsUp, Share2, MoreVertical, Flag, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { deletePost, updatePost } from '../lib/db';
import toast from 'react-hot-toast';

export default function PostCard({ post, onUpdate }) {
  const { user, userData } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.helpful || 0);

  const isOwnPost = user?.uid === post.userId;

  const handleLike = async () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      toast.success('Marked as helpful');
      
      try {
        await updatePost(post.id, {
          helpful: (post.helpful || 0) + 1,
        });
      } catch (error) {
        console.error('Error updating likes:', error);
        setLiked(false);
        setLikeCount(prev => prev - 1);
      }
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost(post.id);
      toast.success('Post deleted');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleReport = () => {
    toast.success('Post reported. We will review it shortly.');
    setShowMenu(false);
  };

  // Calculate distance if user location is available
  const distance = userData?.location && post.location
    ? formatDistance(
        calculateDistance(
          userData.location.lat,
          userData.location.lng,
          post.location.lat,
          post.location.lng
        )
      )
    : null;

  return (
    <article className="card card-hover p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
            {post.authorPhoto ? (
              <img
                src={post.authorPhoto}
                alt={post.authorName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-stone-700">
                {post.authorName?.[0]?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-stone-900">
                {post.authorName || 'Anonymous'}
              </span>
              {post.verified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <time>{formatRelativeTime(post.createdAt)}</time>
              {distance && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {distance}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-stone-600" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowMenu(false)}
              ></div>
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg border border-stone-200 shadow-hover z-50">
                <div className="p-1">
                  {isOwnPost ? (
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete post
                    </button>
                  ) : (
                    <button
                      onClick={handleReport}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50 w-full"
                    >
                      <Flag className="w-4 h-4" />
                      Report post
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className={`badge ${getCategoryColor(post.category)}`}>
          {getCategoryLabel(post.category)}
        </span>
      </div>

      {/* Content */}
      <div className="mb-4">
        {post.title && (
          <h3 className="text-lg font-semibold text-stone-900 mb-2">
            {post.title}
          </h3>
        )}
        <p className="text-stone-700 whitespace-pre-wrap">
          {post.description}
        </p>
      </div>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className={`mb-4 ${post.images.length === 1 ? '' : 'grid grid-cols-2 gap-2'}`}>
          {post.images.slice(0, 4).map((image, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden bg-stone-100 aspect-video"
            >
              <img
                src={image}
                alt={`Post image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 3 && post.images.length > 4 && (
                <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center text-white font-medium">
                  +{post.images.length - 4} more
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Footer - Engagement */}
      <div className="flex items-center gap-6 pt-4 border-t border-stone-200">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            liked
              ? 'text-amber-600'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          <span>{likeCount > 0 ? likeCount : 'Helpful'}</span>
        </button>

        <Link
          href={`/post/${post.id}`}
          className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.comments > 0 ? post.comments : 'Comment'}</span>
        </Link>

        <button className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>

        <div className="flex items-center gap-2 text-sm text-stone-500 ml-auto">
          <Eye className="w-4 h-4" />
          <span>{post.views || 0}</span>
        </div>
      </div>
    </article>
  );
}

// Helper function (should be in utils but included here for completeness)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees) {
  return (degrees * Math.PI) / 180;
}
