import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';
import { Filter, MapPin, TrendingUp } from 'lucide-react';
import { posts as postsAPI } from '../lib/api';

// Accessibility context
import { useAccessibility } from '../contexts/AccessibilityContext';

export default function Feed() {
  const { user, userData } = useAuth();
  const router = useRouter();

  // Accessibility mode from context
  const { accessibilityMode, toggleAccessibility } = useAccessibility();

  // FIXED: Keep ALL posts in allPosts, never modify this
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Load posts from backend on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postsAPI.getAll();
      
      // Convert database format to component format
      const formattedPosts = data.map(post => ({
        id: post.id.toString(),
        userId: post.user_id.toString(),
        authorName: post.author_name,
        authorPhoto: null,
        verified: false,
        category: post.category,
        title: post.title,
        description: post.description,
        neighborhood: post.neighborhood,
        createdAt: new Date(post.created_at),
        views: post.views,
        comments: 0,
        helpful: post.helpful,
        location: { lat: post.latitude, lng: post.longitude },
        images: [],
      }));
      
      setAllPosts(formattedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Fall back to demo data if backend fails
      setAllPosts([
        {
          id: '1',
          userId: 'demo-user-1',
          authorName: 'Sarah Johnson',
          authorPhoto: null,
          verified: true,
          category: 'safety',
          title: 'Suspicious Activity on Oak Street',
          description: 'Saw someone trying car door handles around 2 AM last night. Already reported to police. Everyone please lock your cars!',
          neighborhood: 'Downtown',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          views: 45,
          comments: 3,
          helpful: 8,
          location: { lat: 40.7128, lng: -74.006 },
          images: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // FIXED: Computed filtered posts based on activeFilter
  const filteredPosts = activeFilter === 'all' 
    ? allPosts 
    : allPosts.filter(post => post.category === activeFilter);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'safety', label: 'Safety' },
    { id: 'lost-pet', label: 'Lost Pet' },
    { id: 'event', label: 'Events' },
    { id: 'question', label: 'Questions' },
    { id: 'accessibility', label: 'Accessibility' },
  ];

  return (
    <Layout>
      {/* Accessibility wrapper */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
          accessibilityMode ? 'text-lg font-semibold leading-relaxed' : ''
        }`}
      >
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              {/* Neighborhood Info */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-stone-600" />
                  <h3 className="font-semibold text-stone-900">Your neighborhood</h3>
                </div>
                <p className="text-lg font-medium text-stone-900 mb-1">
                  {userData?.neighborhood || 'Downtown'}
                </p>
                <p className="text-sm text-stone-600">
                  {userData?.address || 'Set your address in settings'}
                </p>
              </div>

              {/* Filters */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-stone-600" />
                  <h3 className="font-semibold text-stone-900">Filter posts</h3>
                </div>
                <div className="space-y-1">
                  {filters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setActiveFilter(filter.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeFilter === filter.id
                          ? 'bg-stone-900 text-white'
                          : 'text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats - FIXED: Use allPosts.length */}
              <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-stone-600" />
                  <h3 className="font-semibold text-stone-900">Activity</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-stone-900">{allPosts.length}</div>
                    <div className="text-sm text-stone-600">Posts this week</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-stone-900">42</div>
                    <div className="text-sm text-stone-600">Active members</div>
                  </div>
                </div>
              </div>

              {/* Accessibility Toggle */}
              <div className="card p-6">
                <h3 className="font-semibold text-stone-900 mb-4">Accessibility</h3>
                <button
                  onClick={toggleAccessibility}
                  className={`w-full py-2 px-3 rounded-lg font-medium transition-colors ${
                    accessibilityMode
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-800 hover:bg-stone-300'
                  }`}
                >
                  {accessibilityMode ? 'Accessibility Mode: ON' : 'Accessibility Mode: OFF'}
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="mb-6">
              <h1
                className={`text-2xl font-bold text-stone-900 mb-2 ${
                  accessibilityMode ? 'text-3xl' : ''
                }`}
              >
                Community feed
              </h1>
              <p className="text-stone-600">
                Stay updated with what&apos;s happening in{' '}
                {userData?.neighborhood || 'your neighborhood'}
              </p>
            </div>

            {/* Mobile Filters */}
            <div className="lg:hidden mb-6 overflow-x-auto scrollbar-thin">
              <div className="flex gap-2 pb-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-stone-900 text-white'
                        : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Post */}
            <Link href="/create" className="btn btn-primary w-full mb-6">
              Create post
            </Link>

            {/* Posts - FIXED: Use filteredPosts */}
            <div className="space-y-4">
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="card p-6 animate-pulse">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-stone-200"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-stone-200 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-stone-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-stone-200 rounded"></div>
                        <div className="h-3 bg-stone-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
                </>
              ) : filteredPosts.length === 0 ? (
                <div className="card p-12 text-center">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-stone-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">No posts in this category</h3>
                  <p className="text-stone-600 mb-6">
                    Try selecting a different filter or create a new post
                  </p>
                  <button 
                    onClick={() => setActiveFilter('all')} 
                    className="btn btn-secondary"
                  >
                    Show all posts
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}