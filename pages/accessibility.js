import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Accessibility,
  MapPin,
  Users,
  AlertCircle,
  Navigation,
  Phone,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AccessibilityMode() {
  const router = useRouter();
  
  // Accessibility Settings
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [screenReaderMode, setScreenReaderMode] = useState(false);
  
  // Walk Buddy
  const [showWalkBuddy, setShowWalkBuddy] = useState(false);
  const [walkBuddyRequest, setWalkBuddyRequest] = useState({
    from: '',
    to: '',
    time: '',
    notes: '',
  });
  const [activeRequests, setActiveRequests] = useState([
    {
      id: '1',
      requester: 'Sarah M.',
      from: '123 Main St',
      to: 'Central Park',
      time: '6:30 PM',
      status: 'waiting',
      distance: '0.8 mi',
    },
    {
      id: '2',
      requester: 'John D.',
      from: 'Library',
      to: '456 Oak Ave',
      time: '7:00 PM',
      status: 'matched',
      buddy: 'Lisa K.',
      distance: '1.2 mi',
    },
  ]);
  
  // Accessible Places
  const [accessiblePlaces] = useState([
    {
      id: '1',
      name: 'Central Park Entrance',
      type: 'park',
      features: ['Wheelchair Ramp', 'Accessible Restroom', 'Braille Signs'],
      distance: '0.3 mi',
      rating: 4.8,
      icon: '🌳',
    },
    {
      id: '2',
      name: 'Community Library',
      type: 'building',
      features: ['Elevator', 'Automatic Doors', 'Hearing Loop'],
      distance: '0.5 mi',
      rating: 4.9,
      icon: '📚',
    },
    {
      id: '3',
      name: 'Main Street Grocery',
      type: 'store',
      features: ['Wide Aisles', 'Accessible Parking', 'Service Animal Friendly'],
      distance: '0.7 mi',
      rating: 4.6,
      icon: '🛒',
    },
    {
      id: '4',
      name: 'City Bus Stop #5',
      type: 'transit',
      features: ['Audio Announcements', 'Lowered Platform', 'Tactile Paving'],
      distance: '0.2 mi',
      rating: 4.7,
      icon: '🚌',
    },
  ]);

  // Voice announcements
  const speak = (text) => {
    if (voiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle voice
  const toggleVoice = () => {
    const newState = !voiceEnabled;
    setVoiceEnabled(newState);
    
    if (newState) {
      speak('Voice guidance enabled. I will now read important information aloud.');
      toast.success('Voice guidance enabled');
    } else {
      toast.success('Voice guidance disabled');
    }
  };

  // Announce page on load
  useEffect(() => {
    if (voiceEnabled) {
      speak('Accessibility mode. This page helps you find wheelchair accessible places and request walk buddies.');
    }
  }, [voiceEnabled]);

  // Request walk buddy
  const handleWalkBuddySubmit = (e) => {
    e.preventDefault();
    
    if (!walkBuddyRequest.from || !walkBuddyRequest.to) {
      toast.error('Please fill in starting point and destination');
      return;
    }

    speak('Walk buddy request submitted. Searching for available neighbors.');
    toast.success('Walk buddy request sent! Searching for available neighbors...');
    
    setShowWalkBuddy(false);
    setWalkBuddyRequest({ from: '', to: '', time: '', notes: '' });
  };

  // Emergency alert
  const sendEmergencyAlert = () => {
    speak('Emergency alert sent to nearby neighbors. Help is on the way.');
    toast.success('Emergency alert sent to nearby neighbors!');
  };

  return (
    <Layout>
      <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-stone-50'} ${largeText ? 'text-lg' : ''}`}>
        {/* Header */}
        <div className={`border-b ${highContrast ? 'border-white bg-black' : 'border-stone-200 bg-white'} px-6 py-4`}>
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${highContrast ? 'bg-white' : 'bg-blue-500'}`}>
                  <Accessibility className={`w-5 h-5 ${highContrast ? 'text-black' : 'text-white'}`} />
                </div>
                <div>
                  <h1 className={`text-xl font-semibold ${highContrast ? 'text-white' : 'text-stone-900'}`}>
                    Accessibility Mode
                  </h1>
                  <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-stone-600'}`}>
                    Enhanced features for everyone
                  </p>
                </div>
              </div>
              
              {/* Emergency Button */}
              <button
                onClick={sendEmergencyAlert}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                aria-label="Send emergency alert"
              >
                <AlertCircle className="w-4 h-4" />
                Emergency
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
          {/* Quick Settings */}
          <div className={`card p-6 mb-6 ${highContrast ? 'bg-gray-900 border-white' : ''}`}>
            <h2 className={`text-lg font-semibold mb-4 ${highContrast ? 'text-white' : 'text-stone-900'}`}>
              Quick Settings
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                onClick={toggleVoice}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  voiceEnabled
                    ? 'bg-blue-500 text-white'
                    : highContrast ? 'bg-gray-800 text-white border border-white' : 'bg-stone-100 text-stone-900'
                }`}
                aria-label={voiceEnabled ? 'Disable voice guidance' : 'Enable voice guidance'}
              >
                <div className="flex items-center gap-3">
                  {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  <span className="font-medium">Voice Guidance</span>
                </div>
                <span className="text-sm">{voiceEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => {
                  setHighContrast(!highContrast);
                  speak(highContrast ? 'High contrast disabled' : 'High contrast enabled');
                }}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  highContrast
                    ? 'bg-white text-black'
                    : 'bg-stone-100 text-stone-900'
                }`}
                aria-label={highContrast ? 'Disable high contrast' : 'Enable high contrast'}
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">High Contrast</span>
                </div>
                <span className="text-sm">{highContrast ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => {
                  setLargeText(!largeText);
                  speak(largeText ? 'Large text disabled' : 'Large text enabled');
                }}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  largeText
                    ? 'bg-blue-500 text-white'
                    : highContrast ? 'bg-gray-800 text-white border border-white' : 'bg-stone-100 text-stone-900'
                }`}
                aria-label={largeText ? 'Disable large text' : 'Enable large text'}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold">A</span>
                  <span className="font-medium">Large Text</span>
                </div>
                <span className="text-sm">{largeText ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => {
                  setScreenReaderMode(!screenReaderMode);
                  speak(screenReaderMode ? 'Screen reader mode disabled' : 'Screen reader mode enabled');
                }}
                className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                  screenReaderMode
                    ? 'bg-blue-500 text-white'
                    : highContrast ? 'bg-gray-800 text-white border border-white' : 'bg-stone-100 text-stone-900'
                }`}
                aria-label={screenReaderMode ? 'Disable screen reader mode' : 'Enable screen reader mode'}
              >
                <div className="flex items-center gap-3">
                  <EyeOff className="w-5 h-5" />
                  <span className="font-medium">Screen Reader</span>
                </div>
                <span className="text-sm">{screenReaderMode ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </div>

          {/* Walk Buddy Section */}
          <div className={`card p-6 mb-6 ${highContrast ? 'bg-gray-900 border-white' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className={`w-5 h-5 ${highContrast ? 'text-white' : 'text-stone-600'}`} />
                <h2 className={`text-lg font-semibold ${highContrast ? 'text-white' : 'text-stone-900'}`}>
                  Walk Buddy
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowWalkBuddy(true);
                  speak('Request walk buddy form opened');
                }}
                className="btn btn-primary"
                aria-label="Request a walk buddy"
              >
                Request Buddy
              </button>
            </div>

            <p className={`text-sm mb-4 ${highContrast ? 'text-gray-300' : 'text-stone-600'}`}>
              Need someone to walk with? Request a trusted neighbor to accompany you home safely.
            </p>

            {/* Active Requests */}
            <div className="space-y-3">
              <h3 className={`text-sm font-medium ${highContrast ? 'text-white' : 'text-stone-700'}`}>
                Active Requests
              </h3>
              {activeRequests.map((request) => (
                <div
                  key={request.id}
                  className={`p-4 rounded-lg border ${
                    highContrast ? 'bg-gray-800 border-white' : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{request.requester}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      request.status === 'matched'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {request.status === 'matched' ? '✓ Matched' : '⏳ Waiting'}
                    </span>
                  </div>
                  <div className={`text-sm space-y-1 ${highContrast ? 'text-gray-300' : 'text-stone-600'}`}>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{request.from} → {request.to}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{request.time} • {request.distance}</span>
                    </div>
                    {request.buddy && (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>Walking with {request.buddy}</span>
                      </div>
                    )}
                  </div>
                  {request.status === 'waiting' && (
                    <button
                      onClick={() => {
                        speak('Offering to be walk buddy');
                        toast.success('Request sent to requester!');
                      }}
                      className="mt-3 w-full btn btn-secondary text-sm"
                    >
                      Offer to Walk
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wheelchair Accessible Places */}
          <div className={`card p-6 ${highContrast ? 'bg-gray-900 border-white' : ''}`}>
            <div className="flex items-center gap-3 mb-4">
              <Accessibility className={`w-5 h-5 ${highContrast ? 'text-white' : 'text-stone-600'}`} />
              <h2 className={`text-lg font-semibold ${highContrast ? 'text-white' : 'text-stone-900'}`}>
                Wheelchair Accessible Places
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {accessiblePlaces.map((place) => (
                <div
                  key={place.id}
                  onClick={() => speak(`${place.name}. ${place.features.join(', ')}`)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    highContrast 
                      ? 'bg-gray-800 border-white hover:bg-gray-700' 
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-card'
                  }`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${place.name}, ${place.distance} away, ${place.features.length} accessible features`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{place.icon}</span>
                      <div>
                        <h3 className={`font-semibold ${highContrast ? 'text-white' : 'text-stone-900'}`}>
                          {place.name}
                        </h3>
                        <div className={`text-sm ${highContrast ? 'text-gray-300' : 'text-stone-600'}`}>
                          {place.distance} away
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="text-sm font-medium">⭐ {place.rating}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    {place.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className={`text-xs flex items-center gap-2 ${
                          highContrast ? 'text-gray-300' : 'text-stone-600'
                        }`}
                      >
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(`Getting directions to ${place.name}`);
                      toast.success(`Opening directions to ${place.name}`);
                    }}
                    className="mt-3 w-full btn btn-secondary text-sm"
                  >
                    <Navigation className="w-3 h-3" />
                    Get Directions
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Walk Buddy Request Modal */}
        {showWalkBuddy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm">
            <div className={`w-full max-w-md rounded-2xl shadow-hover ${
              highContrast ? 'bg-black border-2 border-white' : 'bg-white'
            }`}>
              <div className={`border-b px-6 py-4 flex items-center justify-between ${
                highContrast ? 'border-white' : 'border-stone-200'
              }`}>
                <h2 className={`text-xl font-semibold ${highContrast ? 'text-white' : 'text-stone-900'}`}>
                  Request Walk Buddy
                </h2>
                <button
                  onClick={() => setShowWalkBuddy(false)}
                  className="p-1.5 rounded-lg hover:bg-stone-100"
                  aria-label="Close dialog"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleWalkBuddySubmit} className="p-6 space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    highContrast ? 'text-white' : 'text-stone-700'
                  }`}>
                    Starting Location *
                  </label>
                  <input
                    type="text"
                    value={walkBuddyRequest.from}
                    onChange={(e) => setWalkBuddyRequest({...walkBuddyRequest, from: e.target.value})}
                    className="input"
                    placeholder="Your current location"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    highContrast ? 'text-white' : 'text-stone-700'
                  }`}>
                    Destination *
                  </label>
                  <input
                    type="text"
                    value={walkBuddyRequest.to}
                    onChange={(e) => setWalkBuddyRequest({...walkBuddyRequest, to: e.target.value})}
                    className="input"
                    placeholder="Where you're going"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    highContrast ? 'text-white' : 'text-stone-700'
                  }`}>
                    Preferred Time
                  </label>
                  <input
                    type="time"
                    value={walkBuddyRequest.time}
                    onChange={(e) => setWalkBuddyRequest({...walkBuddyRequest, time: e.target.value})}
                    className="input"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    highContrast ? 'text-white' : 'text-stone-700'
                  }`}>
                    Additional Notes
                  </label>
                  <textarea
                    value={walkBuddyRequest.notes}
                    onChange={(e) => setWalkBuddyRequest({...walkBuddyRequest, notes: e.target.value})}
                    className="input resize-none"
                    rows={3}
                    placeholder="Any specific needs or preferences..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWalkBuddy(false)}
                    className="btn btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
