import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getActiveAlerts } from '../lib/db';
import { AlertTriangle, Phone, MapPin, Clock, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatRelativeTime } from '../lib/utils';

export default function Alerts() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  useEffect(() => {
    // DEMO MODE: Comment out login requirement for testing
    // if (!user) {
    //   router.push('/login');
    //   return;
    // }
    
    loadAlerts();
    
    // Refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, [user, userData]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const neighborhood = userData?.neighborhood || 'Unknown';
      const fetchedAlerts = await getActiveAlerts(neighborhood);
      setAlerts(fetchedAlerts);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', description: 'Police, Fire, Ambulance' },
    { name: 'Non-Emergency Police', number: '311', description: 'For non-urgent matters' },
    { name: 'Poison Control', number: '1-800-222-1222', description: '24/7 poison help' },
    { name: 'Crisis Helpline', number: '988', description: 'Mental health support' },
  ];

  const handleEmergencyCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const getAlertColor = (severity) => {
    const colors = {
      critical: 'bg-red-50 border-red-200 text-red-900',
      high: 'bg-orange-50 border-orange-200 text-orange-900',
      medium: 'bg-amber-50 border-amber-200 text-amber-900',
      low: 'bg-blue-50 border-blue-200 text-blue-900',
    };
    return colors[severity] || colors.low;
  };

  const getAlertIcon = (severity) => {
    return severity === 'critical' || severity === 'high' ? (
      <AlertTriangle className="w-5 h-5" />
    ) : (
      <Shield className="w-5 h-5" />
    );
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Alerts & Emergency</h1>
          <p className="text-stone-600">
            Active alerts and emergency contacts for {userData?.neighborhood || 'your neighborhood'}
          </p>
        </div>

        {/* Emergency Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl shadow-card transition-colors flex items-center justify-center gap-3"
          >
            <Phone className="w-6 h-6" />
            <span className="text-lg">Emergency Contacts</span>
          </button>
        </div>

        {/* Active Alerts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Active alerts</h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-stone-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-stone-200 rounded w-3/4"></div>
                      <div className="h-3 bg-stone-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 mb-2">
                All clear
              </h3>
              <p className="text-stone-600">
                No active alerts in your neighborhood right now
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className={`card p-6 border-2 ${getAlertColor(alert.severity)}`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {getAlertIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{alert.title}</h3>
                      <p className="text-sm mb-3">{alert.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs">
                        {alert.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{alert.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatRelativeTime(alert.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safety Tips */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">Safety tips</h2>
          <ul className="space-y-3 text-sm text-stone-700">
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium">1</span>
              </div>
              <span>Always call 911 in case of immediate danger or emergency</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium">2</span>
              </div>
              <span>Trust your instincts. If something feels wrong, it probably is</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium">3</span>
              </div>
              <span>Share your location with trusted contacts when traveling alone</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium">4</span>
              </div>
              <span>Keep emergency contacts saved in your phone and easily accessible</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => setShowEmergencyModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-hover w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-stone-900">Emergency Contacts</h2>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="p-1.5 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {emergencyContacts.map((contact, index) => (
                <button
                  key={index}
                  onClick={() => handleEmergencyCall(contact.number)}
                  className="w-full card card-hover p-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-stone-900 mb-1">
                        {contact.name}
                      </div>
                      <div className="text-sm text-stone-600 mb-1">
                        {contact.description}
                      </div>
                      <div className="text-lg font-mono font-bold text-red-600">
                        {contact.number}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-6 border-t border-stone-200 bg-stone-50">
              <p className="text-xs text-stone-600 text-center">
                These contacts are for emergency use only. For non-urgent matters, 
                please use the community feed to connect with neighbors.
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
