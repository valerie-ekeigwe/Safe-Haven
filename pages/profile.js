import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { User, Mail, MapPin, Phone, Camera, Edit2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: user?.email || '',
    neighborhood: userData?.neighborhood || 'Downtown',
    address: userData?.address || '',
    phone: userData?.phone || '',
  });

  const handleSave = async () => {
    try {
      // TODO: Save to backend when user update API is ready
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-stone-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-stone-900 mb-4">Please Log In</h2>
            <p className="text-stone-600 mb-6">You need to be logged in to view your profile</p>
            <button
              onClick={() => router.push('/login')}
              className="btn btn-primary"
            >
              Go to Login
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-stone-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          {/* Profile Header */}
          <div className="card p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden">
                    {userData?.photoURL ? (
                      <img
                        src={userData.photoURL}
                        alt={userData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-stone-400" />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-stone-900 rounded-full text-white hover:bg-stone-800 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* User Info */}
                <div>
                  <h1 className="text-2xl font-bold text-stone-900 mb-1">
                    {userData?.name || 'User'}
                  </h1>
                  <p className="text-stone-600">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-stone-400" />
                    <span className="text-sm text-stone-600">
                      {userData?.neighborhood || 'Downtown'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditing(!editing)}
                className={`btn ${editing ? 'btn-secondary' : 'btn-primary'}`}
              >
                {editing ? (
                  <>
                    <X className="w-4 h-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {/* Profile Form */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Your name"
                  />
                ) : (
                  <p className="text-stone-900 py-2">{formData.name || 'Not set'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Email
                </label>
                <p className="text-stone-600 py-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {formData.email}
                </p>
              </div>

              {/* Neighborhood */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Neighborhood
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="input"
                    placeholder="Downtown"
                  />
                ) : (
                  <p className="text-stone-900 py-2">{formData.neighborhood || 'Not set'}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Address
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input"
                    placeholder="123 Main St"
                  />
                ) : (
                  <p className="text-stone-900 py-2">{formData.address || 'Not set'}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                    placeholder="(555) 123-4567"
                  />
                ) : (
                  <p className="text-stone-900 py-2">{formData.phone || 'Not set'}</p>
                )}
              </div>

              {/* Save Button */}
              {editing && (
                <button
                  onClick={handleSave}
                  className="btn btn-primary w-full"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Activity</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900">0</div>
                <div className="text-sm text-stone-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900">0</div>
                <div className="text-sm text-stone-600">Comments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-stone-900">0</div>
                <div className="text-sm text-stone-600">Helpful</div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Account</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/settings')}
                className="w-full btn btn-secondary text-left"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full btn bg-red-500 hover:bg-red-600 text-white"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
