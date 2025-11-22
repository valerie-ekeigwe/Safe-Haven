import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { MapPin, Clock, ThumbsUp, MessageCircle, Share2, Flag, ArrowLeft, User } from 'lucide-react';
import { formatRelativeTime, getCategoryColor, getCategoryLabel } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  // Demo post data
  const [post] = useState({
    id: '1',
    userId: 'demo-user-1',
    authorName: 'Sarah Johnson',
    authorPhoto: null,
    verified: true,
    category: 'safety',
    title: 'Suspicious Activity on Oak Street',
    description: 'Saw someone trying car door handles around 2 AM last night. Already reported to police. Everyone please lock your cars! This has been happening for the past few nights in our area. The person was wearing dark clothing and seemed to be checking multiple cars on the block. Police are aware and increasing patrols.',
    neighborhood: 'Downtown',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    views: 45,
    comments: 3,
    helpful: 8,
    location: { lat: 40.7128, lng: -74.0060 },
    images: []
  });

  const [comments] = useState([
    {
      id: '1',
      userId: 'user-2',
      authorName: 'Mike Chen',
      authorPhoto: null,
      text: 'Thanks for the heads up! I live on that street too. Will make sure to lock my car.',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: '2',
      userId: 'user-3',
      authorName: 'Lisa Martinez',
      authorPhoto: null,
      text: 'Same thing happened on Maple Ave last week. Everyone be careful!',
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: '3',
      userId: 'user-4',
      authorName: 'John Smith',
      authorPhoto: null,
      text: 'Did you get a good look at them? Any security camera footage?',
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? 'Removed from helpful' : 'Marked as helpful');
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    toast.success('Comment posted!');
    setNewComment('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-stone-50 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-600 hover:text-stone-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to feed
          </button>

          {/* Post Card */}
          <article className="card p-6 mb-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                  {post.authorPhoto ? (
                    <img
                      src={post.authorPhoto}
                      alt={post.authorName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-stone-600" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-stone-900">
                      {post.authorName || 'Anonymous'}
                    </span>
                    {post.verified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Clock className="w-3.5 h-3.5" />
                    <time>{formatRelativeTime(post.createdAt)}</time>
                    <span>•</span>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{post.neighborhood}</span>
                  </div>
                </div>
              </div>

              <button className="p-2 rounded-lg hover:bg-stone-100">
                <Flag className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            {/* Category Badge */}
            <div className="mb-4">
              <span className={`badge ${getCategoryColor(post.category)}`}>
                {getCategoryLabel(post.category)}
              </span>
            </div>

            {/* Content */}
            <div className="mb-6">
              {post.title && (
                <h1 className="text-2xl font-bold text-stone-900 mb-3">
                  {post.title}
                </h1>
              )}
              <p className="text-stone-700 text-lg leading-relaxed whitespace-pre-wrap">
                {post.description}
              </p>
            </div>

            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className="mb-6 grid grid-cols-2 gap-3">
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 py-3 border-y border-stone-200 text-sm text-stone-600">
              <span>{post.views} views</span>
              <span>{liked ? post.helpful + 1 : post.helpful} helpful</span>
              <span>{comments.length} comments</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  liked
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                Helpful
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </article>

          {/* Comments Section */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">
              Comments ({comments.length})
            </h2>

            {/* Add Comment */}
            <form onSubmit={handleComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="input resize-none mb-3"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="btn btn-primary"
              >
                <MessageCircle className="w-4 h-4" />
                Post Comment
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-stone-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-stone-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-stone-900">{comment.authorName}</span>
                      <span className="text-xs text-stone-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-stone-700">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}