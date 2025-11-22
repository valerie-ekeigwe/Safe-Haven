import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Shield, Home, Map, Bell, User, LogOut, Settings, Plus, Camera, Accessibility } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }) {
  const { user, userData, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navigation = [
    { name: 'Feed', href: '/feed', icon: Home },
    { name: 'Map', href: '/map', icon: Map },
    { name: 'Cameras', href: '/cameras', icon: Camera },
    { name: 'Accessibility', href: '/accessibility', icon: Accessibility },
    { name: 'Alerts', href: '/alerts', icon: Bell },
  ];

  const isActive = (path) => router.pathname === path;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/feed" className="flex items-center gap-2 text-stone-900">
              <Shield className="w-6 h-6" />
              <span className="text-xl font-semibold">Safe Haven</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-stone-100 text-stone-900'
                        : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <Link href="/create" className="btn btn-primary hidden sm:flex">
                <Plus className="w-4 h-4" />
                Create
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
                    {userData?.photoURL ? (
                      <img
                        src={userData.photoURL}
                        alt={userData.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-stone-600" />
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-stone-200 shadow-hover z-50">
                      <div className="p-4 border-b border-stone-200">
                        <div className="font-medium text-stone-900">{userData?.name || 'User'}</div>
                        <div className="text-sm text-stone-600">{user?.email}</div>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          Your profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-700 hover:bg-stone-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-stone-200">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            logout();
                          }}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-50">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-stone-900 bg-stone-100'
                    : 'text-stone-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
              isActive('/profile')
                ? 'text-stone-900 bg-stone-100'
                : 'text-stone-600'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
