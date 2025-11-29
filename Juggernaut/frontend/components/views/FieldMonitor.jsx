import React, { useState, useRef, useEffect } from 'react';
import { FileUpload } from '../FileUpload';
import { ScanEye, AlertTriangle, Loader2, FileCheck, Upload, Bug, AlertOctagon, CheckCircle2, Camera, X, RefreshCw, SwitchCamera, CloudUpload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../../translations';

export const FieldMonitor = ({ language }) => {
  const t = translations[language];
  
  // --- States ---
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [capturedImage, setCapturedImage] = useState(null); 
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- Camera Logic ---
  const startCameraStream = async () => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  useEffect(() => {
    if (isCameraOpen) {
      startCameraStream();
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode, isCameraOpen]);

  const handleStartCamera = () => {
    setIsCameraOpen(true);
    setCapturedImage(null);
  };

  const handleStopCamera = () => {
    setIsCameraOpen(false);
  };

  const toggleCameraFacing = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageUrl = canvas.toDataURL('image/png');
      setCapturedImage(imageUrl);
      setIsCameraOpen(false);
    }
  };

  // --- Analysis Logic ---
  const handleAnalysis = () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    setAnalysisDone(false);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setAnalyzing(false);
      setAnalysisDone(true);
    }, 2500);
  };

  const resetProcess = () => {
    setCapturedImage(null);
    setAnalysisDone(false);
    setUploadProgress(0);
  };

  const handleFileSelect = (file) => {
    const objectUrl = URL.createObjectURL(file);
    setCapturedImage(objectUrl);
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-24 md:pb-8">
      
      {/* Header */}
      {!isCameraOpen && (
        <div className="flex flex-col gap-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start gap-2 tracking-in-expand">
            {t.newAnalysis || "New Pest Analysis"}
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            Take a photo or upload an image of the affected crop.
          </p>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`bg-white rounded-3xl shadow-sm border border-slate-200 p-4 md:p-8 w-full relative overflow-hidden flex flex-col ${isCameraOpen ? 'h-[80vh]' : 'min-h-[400px]'}`}>
        <AnimatePresence mode="wait">
          
          {/* STATE 1: Analyzing */}
          {analyzing ? (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center text-center p-4 min-h-[300px]"
              >
                <div className="w-full max-w-sm">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
                    <span>{t.analyzing}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-6">
                    <motion.div 
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="relative w-32 h-32 mx-auto mb-6 bg-slate-100 rounded-2xl overflow-hidden border-4 border-blue-100">
                     <img src={capturedImage} alt="Analyzing" className="w-full h-full object-cover opacity-50" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <ScanEye size={48} className="text-blue-600 animate-pulse" />
                     </div>
                  </div>
                  <p className="text-slate-400 text-sm animate-pulse font-medium">Running YOLOv8 Pest Detection Model...</p>
                </div>
              </motion.div>

          /* STATE 2: Results */
          ) : analysisDone ? (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col w-full"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-slate-100 gap-4">
                  <h4 className="font-bold text-slate-800 text-xl flex items-center gap-3">
                    <FileCheck className="text-emerald-500" size={24} />
                    {t.analysisResults}
                  </h4>
                  <button onClick={resetProcess} className="w-full sm:w-auto text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center justify-center gap-2 bg-slate-100 px-4 py-2 rounded-xl transition-colors">
                    <RefreshCw size={16} /> {t.startNew}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <div className="flex items-center gap-2 mb-2 text-red-600">
                      <AlertTriangle size={20} />
                      <p className="text-xs font-bold uppercase tracking-wide">{t.pestSeverity}</p>
                    </div>
                    <p className="text-3xl font-bold text-red-900">High Risk</p>
                    <p className="text-sm text-red-700 mt-1">Immediate intervention required</p>
                    <div className="mt-6 flex gap-1 h-3">
                      <div className="flex-1 bg-red-200 rounded-l-full"></div>
                      <div className="flex-1 bg-red-300"></div>
                      <div className="flex-1 bg-red-500 rounded-r-full shadow-sm"></div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-2 text-slate-500">
                      <Bug size={20} />
                      <p className="text-xs font-bold uppercase tracking-wide">{t.infestationCount}</p>
                    </div>
                    <p className="text-4xl font-bold text-slate-800">24 <span className="text-lg font-medium text-slate-400">detected</span></p>
                    <div className="mt-4 text-sm text-slate-500 bg-white p-3 rounded-xl border border-slate-100">
                      Primary Target: <strong>Fall Armyworm</strong>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wide">{t.recommendations}</p>
                  <div className="p-5 bg-blue-50 border-l-4 border-blue-500 rounded-r-xl shadow-sm">
                      <div className="flex items-start gap-3">
                        <AlertOctagon className="text-blue-600 mt-0.5 shrink-0" size={20} />
                        <div>
                          <h5 className="font-bold text-blue-900 mb-1">Apply Biological Control</h5>
                          <p className="text-sm text-blue-800/80 font-medium leading-relaxed">
                            Spray <strong>Neem Oil (Azadirachtin)</strong> solution (5ml/liter) immediately.
                          </p>
                        </div>
                      </div>
                  </div>
                </div>

                <button 
                  onClick={resetProcess}
                  className="w-full py-4 border-2 border-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all"
                >
                  {t.startNew}
                </button>
              </motion.div>

          /* STATE 3: Camera Live View */
          ) : isCameraOpen ? (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black flex flex-col"
            >
               <video 
                 ref={videoRef} 
                 autoPlay 
                 playsInline 
                 muted 
                 className={`flex-1 w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
               />
               <canvas ref={canvasRef} className="hidden" />
               
               <div className="absolute inset-0 flex flex-col justify-between p-4 md:p-6 z-20 pointer-events-none">
                  <div className="flex justify-between items-start pointer-events-auto">
                     <button onClick={handleStopCamera} className="bg-black/40 p-3 rounded-full backdrop-blur-md text-white border border-white/10 hover:bg-black/60">
                        <X size={24} />
                     </button>
                     <button onClick={toggleCameraFacing} className="bg-black/40 p-3 rounded-full backdrop-blur-md text-white border border-white/10 hover:bg-black/60 flex items-center gap-2">
                        <SwitchCamera size={24} />
                     </button>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                     <div className="w-64 h-64 border-2 border-white/50 rounded-xl"></div>
                  </div>
                  <div className="flex justify-center items-center pb-8 pointer-events-auto">
                     <button 
                       onClick={capturePhoto} 
                       className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm active:scale-95 transition-all shadow-lg hover:bg-white/30"
                     >
                       <div className="w-16 h-16 bg-white rounded-full"></div>
                     </button>
                  </div>
               </div>
            </motion.div>

          /* STATE 4: Selection Screen (Matched to Screenshot) */
          ) : (
            <motion.div 
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col h-full w-full justify-center gap-6"
            >
                {capturedImage ? (
                  <div className="relative z-10 w-full flex flex-col items-center">
                    <div className="relative rounded-2xl overflow-hidden shadow-sm w-full max-w-md bg-slate-50 border border-slate-200 group">
                       <img 
                         src={capturedImage} 
                         alt="Preview" 
                         className="w-full h-auto max-h-[60vh] object-contain mx-auto" 
                       />
                       <div className="absolute top-3 right-3 flex gap-2">
                          <button onClick={() => setCapturedImage(null)} className="bg-black/50 p-2 rounded-full shadow-lg text-white hover:bg-red-500 transition-colors backdrop-blur-md">
                             <X size={20} />
                          </button>
                       </div>
                    </div>
                    <div className="mt-6 w-full max-w-md">
                      <button 
                        onClick={handleAnalysis}
                        className="w-full py-4 rounded-xl font-bold text-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <ScanEye size={20} />
                        {t.runAnalysis}
                      </button>
                      <button 
                        onClick={() => setCapturedImage(null)}
                        className="w-full py-3 mt-3 text-slate-500 font-semibold hover:text-slate-800"
                      >
                        Retake Photo
                      </button>
                    </div>
                  </div>
                ) : (
                  // SELECTION GRID - Matched to Screenshot
                  <div className="flex flex-col gap-4 w-full h-full">
                     
                     {/* CARD 1: CAMERA */}
                     <button 
                       onClick={handleStartCamera}
                       className="w-full py-10 md:py-16 rounded-[2rem] border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300 transition-all flex flex-col items-center justify-center gap-3 group"
                     >
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                           <Camera size={32} className="text-blue-600" />
                        </div>
                        <div className="text-center">
                           <span className="font-bold text-xl text-blue-600 block mb-1">Take Photo</span>
                           <span className="text-xs text-blue-400 uppercase tracking-widest font-bold">Use Camera</span>
                        </div>
                     </button>

                     {/* CARD 2: UPLOAD */}
                     <div className="w-full rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col items-center justify-center relative min-h-[180px] p-6 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm mb-4">
                           <CloudUpload size={32} className="text-emerald-600" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
                          Upload field photos <br className="hidden md:block" /> for instant pest detection.
                        </h3>
                        <p className="text-sm text-slate-400 mb-4 px-4">
                          Drag and drop your image here, or click to browse files
                        </p>
                        
                        {/* Actual File Input Overlay */}
                        <div className="absolute inset-0 opacity-0 cursor-pointer">
                           <FileUpload 
                             label="" 
                             onFileSelect={handleFileSelect} 
                             // Passing style to make it fill the container invisibly
                             className="w-full h-full"
                           />
                        </div>
                     </div>
                  </div>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};