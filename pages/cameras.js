import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Video, Eye, MapPin, Clock, AlertCircle, Play, Pause, Maximize2, Flag } from 'lucide-react';
import { posts } from '../lib/api';
import toast from 'react-hot-toast';

export default function Cameras() {
  const { user, userData } = useAuth();
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportCamera, setReportCamera] = useState(null);
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    urgency: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);

  // Demo cameras with mix of real and simulated feeds
  const cameras = [
    {
      id: 'cam-1',
      name: 'Times Square NYC',
      location: 'New York City',
      status: 'online',
      type: 'street',
      lastUpdate: 'Live',
      recording: true,
      youtubeId: 'rnXIjl_Rzy4', // Working Times Square stream
      isReal: true,
    },
    {
      id: 'cam-2',
      name: 'Central Park View',
      location: 'New York City',
      status: 'online',
      type: 'park',
      lastUpdate: 'Live',
      recording: true,
      isReal: false, // Simulated
    },
    {
      id: 'cam-3',
      name: 'City Traffic Camera',
      location: 'Downtown',
      status: 'online',
      type: 'street',
      lastUpdate: 'Live',
      recording: true,
      isReal: false, // Simulated
    },
    {
      id: 'cam-4',
      name: 'Beach Boardwalk',
      location: 'Miami Beach',
      status: 'online',
      type: 'building',
      lastUpdate: 'Live',
      recording: true,
      isReal: false, // Simulated
    },
    {
      id: 'cam-5',
      name: 'Downtown Plaza',
      location: 'City Center',
      status: 'online',
      type: 'street',
      lastUpdate: 'Live',
      recording: true,
      isReal: false, // Simulated
    },
    {
      id: 'cam-6',
      name: 'Harbor View',
      location: 'Waterfront',
      status: 'online',
      type: 'parking',
      lastUpdate: 'Live',
      recording: true,
      isReal: false, // Simulated
    },
  ];

  const getStatusColor = (status) => {
    return status === 'online' ? 'bg-green-500' : 'bg-red-500';
  };

  const getCameraIcon = (type) => {
    switch(type) {
      case 'street': return '🛣️';
      case 'park': return '🌳';
      case 'school': return '🏫';
      case 'building': return '🏢';
      case 'parking': return '🅿️';
      default: return '📹';
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-4rem)] bg-stone-900 overflow-hidden">
        {/* Header */}
        <div className="bg-stone-950 border-b border-stone-800 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Camera Monitoring</h1>
                <p className="text-sm text-stone-400">Live neighborhood surveillance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  setShowReportForm(true);
                  setReportCamera(null);
                }}
                className="btn btn-primary"
              >
                <Flag className="w-4 h-4" />
                Report Issue
              </button>
              
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-400">
                  {cameras.filter(c => c.status === 'online').length} Online
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-400">
                  {cameras.filter(c => c.status === 'offline').length} Offline
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6 h-full overflow-y-auto pb-24 md:pb-6">
          {/* Camera Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cameras.map((camera) => (
              <div
                key={camera.id}
                onClick={() => setSelectedCamera(camera)}
                className={`bg-stone-800 rounded-xl overflow-hidden border cursor-pointer transition-all ${
                  selectedCamera?.id === camera.id
                    ? 'border-amber-500 ring-2 ring-amber-500/20'
                    : 'border-stone-700 hover:border-stone-600'
                }`}
              >
                {/* Camera View - Real or Simulated */}
                <div className="relative aspect-video bg-stone-900 flex items-center justify-center overflow-hidden">
                  {camera.status === 'online' ? (
                    <>
                      {camera.isReal ? (
                        // REAL YouTube Stream
                        <>
                          <iframe
                            src={`https://www.youtube.com/embed/${camera.youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&playsinline=1`}
                            className="absolute inset-0 w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={camera.name}
                          />
                          
                          {/* Overlay gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-stone-900/50 pointer-events-none z-10"></div>
                        </>
                      ) : (
                        // SIMULATED Feed
                        <>
                          <div className="absolute inset-0">
                            <div className={`absolute inset-0 ${
                              camera.type === 'street' ? 'bg-gradient-to-b from-blue-900 to-stone-800' :
                              camera.type === 'park' ? 'bg-gradient-to-b from-green-900 to-stone-800' :
                              camera.type === 'building' ? 'bg-gradient-to-b from-gray-900 to-stone-900' :
                              'bg-gradient-to-b from-stone-800 to-stone-900'
                            }`}>
                              <div className="absolute inset-0 opacity-40">
                                {camera.type === 'street' && (
                                  <>
                                    <div className="absolute top-1/3 left-0 w-16 h-3 bg-yellow-400 rounded-full blur-md animate-[moveRight_8s_linear_infinite]"></div>
                                    <div className="absolute top-2/3 right-0 w-16 h-3 bg-red-400 rounded-full blur-md animate-[moveLeft_6s_linear_infinite]"></div>
                                  </>
                                )}
                                
                                {(camera.type === 'park' || camera.type === 'building') && (
                                  <>
                                    <div className="absolute bottom-1/4 left-1/4 w-8 h-20 bg-stone-700 rounded-full blur-lg animate-[walkRight_12s_ease-in-out_infinite]"></div>
                                    <div className="absolute bottom-1/4 right-1/3 w-8 h-20 bg-stone-700 rounded-full blur-lg animate-[walkLeft_15s_ease-in-out_infinite]"></div>
                                  </>
                                )}
                                
                                <div className="absolute top-0 right-1/4 w-6 h-6 bg-yellow-300 rounded-full blur-xl animate-pulse opacity-50"></div>
                                <div className="absolute top-0 left-1/4 w-6 h-6 bg-yellow-300 rounded-full blur-xl animate-pulse opacity-40" style={{animationDelay: '1.5s'}}></div>
                              </div>
                              
                              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-stone-950 to-transparent"></div>
                              
                              {camera.type === 'street' && (
                                <>
                                  <div className="absolute bottom-0 left-1/4 w-20 h-40 bg-stone-950 opacity-80"></div>
                                  <div className="absolute bottom-0 right-1/3 w-24 h-48 bg-stone-950 opacity-80"></div>
                                </>
                              )}
                              
                              {camera.type === 'park' && (
                                <>
                                  <div className="absolute bottom-0 left-1/4 w-16 h-32 bg-green-950 rounded-t-full opacity-70"></div>
                                  <div className="absolute bottom-0 right-1/4 w-20 h-40 bg-green-950 rounded-t-full opacity-70"></div>
                                </>
                              )}
                              
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent opacity-5 animate-[scan_3s_linear_infinite]"></div>
                            </div>
                          </div>
                          
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-6xl opacity-20">{getCameraIcon(camera.type)}</div>
                          </div>
                          
                          {/* Demo indicator for simulated feeds */}
                          <div className="absolute top-12 left-3 px-2 py-1 bg-amber-500/90 backdrop-blur-sm rounded-md z-20 pointer-events-none">
                            <span className="text-xs font-medium text-white">DEMO FEED</span>
                          </div>
                        </>
                      )}
                      
                      {/* Recording indicator */}
                      {camera.recording && (
                        <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-md z-20 pointer-events-none">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-white">● LIVE</span>
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-stone-900/90 backdrop-blur-sm rounded-md z-20 pointer-events-none">
                        <span className="text-xs font-mono text-white">
                          {new Date().toLocaleTimeString()} • {camera.name}
                        </span>
                      </div>
                      
                      {/* Camera ID */}
                      <div className="absolute top-3 right-3 px-2 py-1 bg-stone-900/90 backdrop-blur-sm rounded-md z-20 pointer-events-none">
                        <span className="text-xs font-mono text-white">CAM-{camera.id.split('-')[1]}</span>
                      </div>
                      
                      {/* Expand button */}
                      <div className="absolute bottom-3 right-3 z-20">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (camera.isReal) {
                              window.open(`https://www.youtube.com/watch?v=${camera.youtubeId}`, '_blank');
                            } else {
                              setSelectedCamera(selectedCamera?.id === camera.id ? null : camera);
                            }
                          }}
                          className="p-1.5 bg-stone-900/90 backdrop-blur-sm rounded-md hover:bg-stone-800 transition-colors"
                          title={camera.isReal ? "Open full stream" : "View fullscreen"}
                        >
                          <Maximize2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-stone-600">
                      <AlertCircle className="w-8 h-8" />
                      <span className="text-sm font-medium">Camera Offline</span>
                    </div>
                  )}
                </div>

                {/* Camera Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{camera.name}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-stone-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{camera.location}</span>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(camera.status)} flex-shrink-0 mt-1.5`}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{camera.lastUpdate}</span>
                    </div>
                    {camera.recording && (
                      <div className="flex items-center gap-1 text-red-400">
                        <Video className="w-3 h-3" />
                        <span>Recording</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info Banner */}
          <div className="mt-6 bg-stone-800 border border-stone-700 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Community Camera Network</h3>
                <p className="text-sm text-stone-400 mb-3">
                  These cameras are part of our neighborhood safety initiative. All feeds are monitored 
                  and recorded for security purposes. Footage is retained for 30 days.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-stone-700 rounded-md text-xs text-stone-300">
                    ✓ 24/7 Monitoring
                  </span>
                  <span className="px-2 py-1 bg-stone-700 rounded-md text-xs text-stone-300">
                    ✓ Motion Detection
                  </span>
                  <span className="px-2 py-1 bg-stone-700 rounded-md text-xs text-stone-300">
                    ✓ HD Recording
                  </span>
                  <span className="px-2 py-1 bg-stone-700 rounded-md text-xs text-stone-300">
                    ✓ Night Vision
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Report Button (Mobile) */}
        <button
          onClick={() => {
            setShowReportForm(true);
            setReportCamera(null);
          }}
          className="md:hidden fixed bottom-20 right-6 w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 z-40"
        >
          <Flag className="w-7 h-7 text-white" />
        </button>

        {/* Report Issue Modal */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-stone-900">Report Camera Issue</h3>
                    {reportCamera && (
                      <p className="text-sm text-stone-600 mt-1">
                        Camera: {reportCamera.name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setShowReportForm(false);
                      setReportData({ title: '', description: '', urgency: 'medium' });
                    }}
                    className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <AlertCircle className="w-5 h-5 text-stone-600" />
                  </button>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    
                    if (!reportData.title || !reportData.description) {
                      toast.error('Please fill in all fields');
                      return;
                    }

                    setSubmitting(true);

                    try {
                      const postData = {
                        userId: user?.id || 1,
                        authorName: userData?.name || 'Anonymous User',
                        category: 'safety',
                        title: reportData.title,
                        description: `${reportData.description}${reportCamera ? `\n\nReported from camera: ${reportCamera.name} (${reportCamera.location})` : ''}`,
                        neighborhood: userData?.neighborhood || 'Downtown',
                        latitude: 40.7128,
                        longitude: -74.0060,
                      };

                      await posts.create(postData);
                      
                      toast.success('Issue reported successfully! 🚨');
                      setShowReportForm(false);
                      setReportData({ title: '', description: '', urgency: 'medium' });
                    } catch (error) {
                      console.error('Error reporting issue:', error);
                      toast.error('Failed to report issue');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Issue Title
                    </label>
                    <input
                      type="text"
                      value={reportData.title}
                      onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
                      className="input w-full"
                      placeholder="e.g., Suspicious activity detected"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={reportData.description}
                      onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                      className="input w-full min-h-[120px]"
                      placeholder="Describe what you saw..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={reportData.urgency}
                      onChange={(e) => setReportData({ ...reportData, urgency: e.target.value })}
                      className="input w-full"
                    >
                      <option value="low">Low - Informational</option>
                      <option value="medium">Medium - Needs Attention</option>
                      <option value="high">High - Important</option>
                      <option value="emergency">Emergency - Immediate Action Required</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReportForm(false);
                        setReportData({ title: '', description: '', urgency: 'medium' });
                      }}
                      className="btn btn-secondary flex-1"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}