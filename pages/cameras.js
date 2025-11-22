import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Camera, Video, Eye, MapPin, Clock, AlertCircle, Play, Pause, Maximize2 } from 'lucide-react';

export default function Cameras() {
  const [selectedCamera, setSelectedCamera] = useState(null);

  // Demo cameras - In production these would be real camera feeds
  const cameras = [
    {
      id: 'cam-1',
      name: 'Main Street Entrance',
      location: 'Main St & 1st Ave',
      status: 'online',
      type: 'street',
      lastUpdate: '2 mins ago',
      recording: true,
    },
    {
      id: 'cam-2',
      name: 'Park Playground',
      location: 'Central Park',
      status: 'online',
      type: 'park',
      lastUpdate: '1 min ago',
      recording: true,
    },
    {
      id: 'cam-3',
      name: 'School Zone Camera',
      location: 'Oakwood Elementary',
      status: 'online',
      type: 'school',
      lastUpdate: '30 secs ago',
      recording: true,
    },
    {
      id: 'cam-4',
      name: 'Community Center',
      location: '456 Center St',
      status: 'online',
      type: 'building',
      lastUpdate: '1 min ago',
      recording: true,
    },
    {
      id: 'cam-5',
      name: 'Oak Street Corner',
      location: 'Oak St & Maple Ave',
      status: 'offline',
      type: 'street',
      lastUpdate: '15 mins ago',
      recording: false,
    },
    {
      id: 'cam-6',
      name: 'Parking Lot View',
      location: 'Community Parking',
      status: 'online',
      type: 'parking',
      lastUpdate: '45 secs ago',
      recording: true,
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
              <Link href="/report" className="btn btn-primary">
                <Camera className="w-4 h-4" />
                Report Issue
              </Link>
              
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
                {/* Camera View */}
                <div className="relative aspect-video bg-stone-900 flex items-center justify-center">
                  {camera.status === 'online' ? (
                    <>
                      {/* Simulated camera feed */}
                      <div className="absolute inset-0 bg-gradient-to-br from-stone-800 to-stone-900">
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-stone-600 rounded-full blur-3xl animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* Camera overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl opacity-30">{getCameraIcon(camera.type)}</div>
                      </div>
                      
                      {/* Recording indicator */}
                      {camera.recording && (
                        <div className="absolute top-3 left-3 flex items-center gap-2 px-2 py-1 bg-red-500 rounded-md">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium text-white">REC</span>
                        </div>
                      )}
                      
                      {/* Timestamp */}
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-stone-900/80 backdrop-blur-sm rounded-md">
                        <span className="text-xs font-mono text-white">
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {/* Expand button */}
                      <div className="absolute bottom-3 right-3">
                        <button className="p-1.5 bg-stone-900/80 backdrop-blur-sm rounded-md hover:bg-stone-800 transition-colors">
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
        <Link
          href="/report"
          className="md:hidden fixed bottom-20 right-6 w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50 z-40"
        >
          <Camera className="w-7 h-7 text-white" />
        </Link>
      </div>
    </Layout>
  );
}
