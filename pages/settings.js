import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Eye, 
  Shield, 
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Volume2,
  MapPin,
  Users,
  AlertCircle,
  Save,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    safetyAlerts: true,
    walkBuddyRequests: true,
    communityUpdates: true,
    
    // Privacy
    showLocation: true,
    showProfile: true,
    allowMessages: true,
    
    // Accessibility
    voiceGuidance: false,
    highContrast: false,
    largeText: false,
    
    // Display
    darkMode: false,
    compactView: false,
  });

  const handleSave = () => {
    // TODO: Save to backend
    toast.success('Settings saved successfully! ✅');
  };

  const handleDeleteAccount = () => {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    
    if (confirmed) {
      // TODO: Delete account API call
      toast.success('Account deleted');
      logout();
      router.push('/');
    }
  };

  const toggleSetting = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-stone-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-900 mb-2">Settings</h1>
            <p className="text-stone-600">Manage your account preferences and privacy</p>
          </div>

          {/* Notifications Section */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">Notifications</h2>
                <p className="text-sm text-stone-600">Choose how you want to be notified</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between py-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">Email Notifications</div>
                    <div className="text-sm text-stone-600">Receive updates via email</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => toggleSetting('emailNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between py-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">Push Notifications</div>
                    <div className="text-sm text-stone-600">Get alerts on your device</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => toggleSetting('pushNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between py-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">SMS Notifications</div>
                    <div className="text-sm text-stone-600">Receive text messages</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={() => toggleSetting('smsNotifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Safety Alerts */}
              <div className="flex items-center justify-between py-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div>
                    <div className="font-medium text-stone-900">Safety Alerts</div>
                    <div className="text-sm text-stone-600">Emergency and safety notifications</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.safetyAlerts}
                    onChange={() => toggleSetting('safetyAlerts')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* Walk Buddy Requests */}
              <div className="flex items-center justify-between py-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">Walk Buddy Requests</div>
                    <div className="text-sm text-stone-600">Get notified of walk requests</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.walkBuddyRequests}
                    onChange={() => toggleSetting('walkBuddyRequests')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Community Updates */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">Community Updates</div>
                    <div className="text-sm text-stone-600">Events and neighborhood news</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.communityUpdates}
                    onChange={() => toggleSetting('communityUpdates')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">Privacy</h2>
                <p className="text-sm text-stone-600">Control your visibility and privacy</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Show Location */}
              <div className="flex items-center justify-between py-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">Show Location</div>
                    <div className="text-sm text-stone-600">Display your neighborhood on posts</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showLocation}
                    onChange={() => toggleSetting('showLocation')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Public Profile */}
              <div className="flex items-center justify-between py-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">Public Profile</div>
                    <div className="text-sm text-stone-600">Allow others to view your profile</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.showProfile}
                    onChange={() => toggleSetting('showProfile')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Allow Messages */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">Allow Messages</div>
                    <div className="text-sm text-stone-600">Let neighbors message you</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowMessages}
                    onChange={() => toggleSetting('allowMessages')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Display Section */}
          <div className="card p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">Display</h2>
                <p className="text-sm text-stone-600">Customize how the app looks</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Dark Mode */}
              <div className="flex items-center justify-between py-3 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">Dark Mode</div>
                    <div className="text-sm text-stone-600">Use dark theme</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={() => toggleSetting('darkMode')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-800"></div>
                </label>
              </div>

              {/* Compact View */}
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">Compact View</div>
                    <div className="text-sm text-stone-600">Show more content at once</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.compactView}
                    onChange={() => toggleSetting('compactView')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="btn btn-primary w-full mb-6"
          >
            <Save className="w-5 h-5" />
            Save Settings
          </button>

          {/* Danger Zone */}
          <div className="card p-6 border-2 border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-900">Danger Zone</h2>
                <p className="text-sm text-stone-600">Irreversible actions</p>
              </div>
            </div>

            <button
              onClick={handleDeleteAccount}
              className="w-full btn bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="w-5 h-5" />
              Delete Account
            </button>
            <p className="text-xs text-stone-500 mt-2 text-center">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
