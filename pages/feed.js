import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import PostCard from '../components/PostCard';

export default function Feed() {
  const { userData } = useAuth();
  const [posts] = useState([
    {
      id: '1',
      authorName: 'Sarah Johnson',
      verified: true,
      category: 'safety',
      title: 'Suspicious Activity',
      description: 'Saw someone trying car door handles. Please lock your cars!',
      neighborhood: 'Downtown',
      createdAt: new Date(),
      views: 45,
      comments: 3,
      helpful: 8,
    },
    {
      id: '2',
      authorName: 'Mike Chen',
      category: 'lost-pet',
      title: 'Lost Cat',
      description: 'Orange tabby missing. Very friendly!',
      neighborhood: 'Downtown',
      createdAt: new Date(),
      views: 67,
      comments: 5,
      helpful: 12,
    }
  ]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Community Feed (Demo Mode)</h1>
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
