import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Camera, Video, StopCircle, RotateCw, X, Check, Upload, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CameraCapture() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'user' for selfie, 'environment' for back camera
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportData, setReportData] = useState({
    category: 'safety',
    description: '',
  });

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setIsStreaming(true);
        toast.success('Camera started!');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Could not access camera. Please allow camera permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
      setIsStreaming(false);
      setIsRecording(false);
    }
  };

  // Take photo
  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    setShowReportForm(true);
    
    toast.success('Photo captured!');
  };

  // Flip camera (front/back)
  const flipCamera = async () => {
    stopCamera();
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    setShowReportForm(false);
  };

  // Submit report
  const submitReport = async () => {
    if (!reportData.description.trim()) {
      toast.error('Please add a description');
      return;
    }

    // In production, this would upload to Firebase
    toast.success('Report submitted successfully!');
    
    // Reset and redirect to feed
    setCapturedImage(null);
    setShowReportForm(false);
    setReportData({ category: 'safety', description: '' });
    
    // REDIRECT TO FEED after 1 second
    setTimeout(() => {
      router.push('/feed');
    }, 1000);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const categories = [
    { id: 'safety', label: 'Safety Issue', icon: '🚨' },
    { id: 'vandalism', label: 'Vandalism', icon: '🎨' },
    { id: 'trash', label: 'Trash/Debris', icon: '🗑️' },
    { id: 'traffic', label: 'Traffic Issue', icon: '🚗' },
    { id: 'other', label: 'Other', icon: '📋' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-stone-900">
        {/* Header */}
        <div className="bg-stone-950 border-b border-stone-800 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Report with Camera</h1>
                <p className="text-sm text-stone-400">Capture and report issues in real-time</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6 pb-24 md:pb-6">
          {!capturedImage ? (
            // Camera View
            <div className="space-y-4">
              {/* Video Preview */}
              <div className="relative bg-stone-950 rounded-2xl overflow-hidden aspect-[3/4] max-h-[70vh]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {/* Hidden canvas for capture */}
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Camera overlay */}
                {!isStreaming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-900">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Camera className="w-10 h-10 text-stone-400" />
                      </div>
                      <p className="text-stone-400 mb-4">Camera not started</p>
                      <button
                        onClick={startCamera}
                        className="btn btn-primary"
                      >
                        <Camera className="w-4 h-4" />
                        Start Camera
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Recording indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-red-500 rounded-lg">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-white">RECORDING</span>
                  </div>
                )}
                
                {/* Guide Grid */}
                {isStreaming && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="w-full h-full border-2 border-white/20 m-8">
                      <div className="absolute top-1/2 left-0 right-0 border-t border-white/10"></div>
                      <div className="absolute left-1/2 top-0 bottom-0 border-l border-white/10"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              {isStreaming && (
                <div className="flex items-center justify-center gap-4">
                  {/* Flip Camera */}
                  <button
                    onClick={flipCamera}
                    className="w-14 h-14 bg-stone-800 hover:bg-stone-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <RotateCw className="w-6 h-6 text-white" />
                  </button>

                  {/* Capture Button */}
                  <button
                    onClick={takePhoto}
                    className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg shadow-red-500/50"
                  >
                    <div className="w-16 h-16 border-4 border-white rounded-full"></div>
                  </button>

                  {/* Stop Camera */}
                  <button
                    onClick={stopCamera}
                    className="w-14 h-14 bg-stone-800 hover:bg-stone-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-stone-800 rounded-xl p-6 border border-stone-700">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">How to Report</h3>
                    <ol className="text-sm text-stone-400 space-y-2">
                      <li>1. Click "Start Camera" to enable your camera</li>
                      <li>2. Point your camera at the issue you want to report</li>
                      <li>3. Click the red capture button to take a photo</li>
                      <li>4. Add details and submit your report</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Report Form with Captured Image
            <div className="space-y-4">
              {/* Captured Image Preview */}
              <div className="relative bg-stone-950 rounded-2xl overflow-hidden">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-auto"
                />
                
                {/* Success badge */}
                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-green-500 rounded-lg">
                  <Check className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white">Captured</span>
                </div>
              </div>

              {/* Report Form */}
              {showReportForm && (
                <div className="bg-stone-800 rounded-xl p-6 border border-stone-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Report Details</h3>
                  
                  {/* Category Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-stone-300 mb-2">
                      What's the issue?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setReportData({ ...reportData, category: cat.id })}
                          className={`p-3 rounded-lg text-sm font-medium transition-all ${
                            reportData.category === cat.id
                              ? 'bg-red-500 text-white'
                              : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                          }`}
                        >
                          <div className="text-xl mb-1">{cat.icon}</div>
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-stone-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={reportData.description}
                      onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                      placeholder="Describe what you're reporting..."
                      rows={4}
                      className="w-full px-4 py-3 bg-stone-900 border border-stone-700 rounded-lg text-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={retakePhoto}
                      className="flex-1 px-6 py-3 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Retake Photo
                    </button>
                    <button
                      onClick={submitReport}
                      className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Submit Report
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
