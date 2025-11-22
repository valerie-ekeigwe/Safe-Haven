import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { Shield, Users, Bell, Map, ChevronRight, Eye, Heart, MessageCircle } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState('');

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (user) {
      router.push('/feed');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-stone-900" />
              <span className="text-xl font-semibold text-stone-900">Safe Haven</span>
            </div>
            
            <div className="flex items-center gap-4">
              {user ? (
                <Link href="/feed" className="btn btn-primary">
                  Go to Feed
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn btn-ghost">
                    Log in
                  </Link>
                  <Link href="/signup" className="btn btn-primary">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-stone-900 leading-tight">
            Your neighborhood,
            <br />
            <span className="text-stone-600">safer together</span>
          </h1>
          
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            Stay connected with your community. Share updates, report incidents, 
            and keep everyone informed in real-time.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button onClick={handleGetStarted} className="btn btn-primary text-base px-6 py-3">
              Get started
              <ChevronRight className="w-4 h-4" />
            </button>
            <Link href="/about" className="btn btn-ghost text-base px-6 py-3">
              Learn more
            </Link>
          </div>
        </div>

        {/* Hero Visual - Simple illustration */}
        <div className="mt-20 relative">
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-card">
            <div className="grid grid-cols-3 gap-4">
              {/* Example post cards */}
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-stone-200 rounded w-20 mb-1"></div>
                    <div className="h-2 bg-stone-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-stone-200 rounded"></div>
                  <div className="h-2 bg-stone-200 rounded w-3/4"></div>
                </div>
              </div>

              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-stone-200 rounded w-20 mb-1"></div>
                    <div className="h-2 bg-stone-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-stone-200 rounded"></div>
                  <div className="h-2 bg-stone-200 rounded w-3/4"></div>
                </div>
              </div>

              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-stone-200 rounded w-20 mb-1"></div>
                    <div className="h-2 bg-stone-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-stone-200 rounded"></div>
                  <div className="h-2 bg-stone-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Real community connection
                </h3>
                <p className="text-stone-600">
                  Connect with verified neighbors in your area. Build trust and strengthen 
                  your local community bonds.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Instant notifications
                </h3>
                <p className="text-stone-600">
                  Get notified immediately about important events in your neighborhood. 
                  Stay informed, stay safe.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center flex-shrink-0">
                <Map className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Visual neighborhood map
                </h3>
                <p className="text-stone-600">
                  See what's happening around you on an interactive map. Location-based 
                  updates keep you aware.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Built for accessibility
                </h3>
                <p className="text-stone-600">
                  Find accessible routes, report obstacles, and help create a more 
                  inclusive neighborhood for everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-stone-900 mb-3">
              Trusted by neighborhoods everywhere
            </h2>
            <p className="text-stone-600">
              Join thousands of community members making their areas safer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-stone-900 mb-2">12,500+</div>
              <div className="text-stone-600">Active users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-stone-900 mb-2">450+</div>
              <div className="text-stone-600">Neighborhoods</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-stone-900 mb-2">50K+</div>
              <div className="text-stone-600">Posts shared</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-stone-900 mb-4">
          Ready to make your neighborhood safer?
        </h2>
        <p className="text-lg text-stone-600 mb-8">
          Join Safe Haven today and start connecting with your community
        </p>
        <button onClick={handleGetStarted} className="btn btn-primary text-base px-8 py-3">
          Get started free
          <ChevronRight className="w-4 h-4" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-stone-900" />
                <span className="font-semibold text-stone-900">Safe Haven</span>
              </div>
              <p className="text-sm text-stone-600">
                Building safer, more connected communities.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/about">About</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/guidelines">Community Guidelines</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-stone-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-stone-600">
                <li><Link href="/privacy">Privacy</Link></li>
                <li><Link href="/terms">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-200 mt-8 pt-8 text-center text-sm text-stone-600">
            © 2024 Safe Haven. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
