import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Shield, Mail, Lock, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    neighborhood: 'Downtown',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up
        if (!formData.name) {
          toast.error('Please enter your name');
          setLoading(false);
          return;
        }

        await signup(
          formData.email,
          formData.password,
          formData.name,
          formData.neighborhood
        );

        toast.success('Account created! Welcome to Safe Haven 🎉');
        router.push('/feed');
      } else {
        // Login
        await login(formData.email, formData.password);
        toast.success('Welcome back! 👋');
        router.push('/feed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-stone-900 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">Safe Haven</h1>
          <p className="text-stone-600">Your neighborhood's safety network</p>
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="text-stone-600">
              {isSignUp
                ? 'Join your neighborhood community'
                : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (Sign up only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input pl-10"
                    placeholder="John Doe"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Neighborhood (Sign up only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Neighborhood
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      setFormData({ ...formData, neighborhood: e.target.value })
                    }
                    className="input pl-10"
                    placeholder="Downtown"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading
                ? 'Loading...'
                : isSignUp
                ? 'Create account'
                : 'Sign in'}
            </button>
          </form>

          {/* Toggle Sign Up / Login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setFormData({
                  email: '',
                  password: '',
                  name: '',
                  neighborhood: 'Downtown',
                });
              }}
              className="text-stone-600 hover:text-stone-900 text-sm"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : 'Don&apos;t have an account? Sign up'}
            </button>
          </div>

          {/* Demo Account Info */}
          {!isSignUp && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900 font-medium mb-2">
                🎯 Quick Demo:
              </p>
              <p className="text-xs text-blue-700">
                Create a new account or browse as guest by going to{' '}
                <Link href="/feed" className="underline font-medium">
                  /feed
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-stone-600 hover:text-stone-900 text-sm font-medium"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}