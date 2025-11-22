import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import dynamic from 'next/dynamic';
import { getPosts } from '../lib/db';
import { Filter, Layers } from 'lucide-react';
import toast from 'react-hot-toast';

// Dynamically import the map component to avoid SSR issues
const MapView = dynamic(() => import('../components/MapView'), { ssr: false });

export default function Map() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({
    safety: true,
    'lost-pet': true,
    event: true,
    question: true,
    accessibility: true,
    other: true,
  });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    // DEMO MODE: Comment out login requirement for testing
    // if (!user) {
    //   router.push('/login');
    //   return;
    // }
    
    loadPosts();
  }, [user, timeRange]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const filters = {};
      
      if (userData?.neighborhood) {
        filters.neighborhood = userData.neighborhood;
      }

      const fetchedPosts = await getPosts(filters);
      
      // Filter by time range
      let filteredPosts = fetchedPosts;
      if (timeRange !== 'all') {
        const now = new Date();
        const cutoff = new Date();
        
        if (timeRange === '24h') {
          cutoff.setHours(now.getHours() - 24);
        } else if (timeRange === '7d') {
          cutoff.setDate(now.getDate() - 7);
        } else if (timeRange === '30d') {
          cutoff.setDate(now.getDate() - 30);
        }
        
        filteredPosts = fetchedPosts.filter(post => new Date(post.createdAt) > cutoff);
      }
      
      setPosts(filteredPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (category) => {
    setActiveFilters(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredPosts = posts.filter(post => 
    post.location && activeFilters[post.category]
  );

  const filterOptions = [
    { id: 'safety', label: 'Safety', color: 'bg-red-500' },
    { id: 'lost-pet', label: 'Lost Pet', color: 'bg-blue-500' },
    { id: 'event', label: 'Event', color: 'bg-green-500' },
    { id: 'question', label: 'Question', color: 'bg-amber-500' },
    { id: 'accessibility', label: 'Accessibility', color: 'bg-purple-500' },
    { id: 'other', label: 'Other', color: 'bg-stone-500' },
  ];

  const timeRanges = [
    { id: 'all', label: 'All time' },
    { id: '24h', label: 'Last 24 hours' },
    { id: '7d', label: 'Last 7 days' },
    { id: '30d', label: 'Last 30 days' },
  ];

  return (
    <Layout>
      <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
        {/* Map */}
        <div className="absolute inset-0">
          {loading ? (
            <div className="flex items-center justify-center h-full bg-stone-100">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-stone-600">Loading map...</p>
              </div>
            </div>
          ) : (
            <MapView posts={filteredPosts} userLocation={userData?.location} />
          )}
        </div>

        {/* Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-4">
            {/* Left side - Stats */}
            <div className="card p-4 pointer-events-auto">
              <div className="text-2xl font-bold text-stone-900 mb-1">
                {filteredPosts.length}
              </div>
              <div className="text-sm text-stone-600">
                {filteredPosts.length === 1 ? 'post' : 'posts'} on map
              </div>
            </div>

            {/* Right side - Filters */}
            <div className="space-y-2">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="btn btn-secondary pointer-events-auto"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {showFilterPanel && (
                <div className="card p-4 space-y-4 pointer-events-auto">
                  {/* Time Range */}
                  <div>
                    <div className="text-sm font-medium text-stone-700 mb-2">
                      Time range
                    </div>
                    <div className="space-y-1">
                      {timeRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => setTimeRange(range.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            timeRange === range.id
                              ? 'bg-stone-900 text-white'
                              : 'text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Filters */}
                  <div>
                    <div className="text-sm font-medium text-stone-700 mb-2">
                      Categories
                    </div>
                    <div className="space-y-1">
                      {filterOptions.map((option) => (
                        <label
                          key={option.id}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-stone-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={activeFilters[option.id]}
                            onChange={() => toggleFilter(option.id)}
                            className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                          />
                          <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                          <span className="text-sm text-stone-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
          <div className="card p-4 pointer-events-auto">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-stone-600" />
              <span className="text-sm font-medium text-stone-700">Legend</span>
            </div>
            <div className="space-y-2">
              {filterOptions.map((option) => (
                activeFilters[option.id] && (
                  <div key={option.id} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                    <span className="text-xs text-stone-600">{option.label}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
