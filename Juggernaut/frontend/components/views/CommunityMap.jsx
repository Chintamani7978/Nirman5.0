import React, { useState, useRef, useEffect } from 'react';
import { Users, Plus, Filter, AlertTriangle, Bug, CloudLightning, ChevronRight, Search, X, ShieldAlert, CheckCircle, ThumbsUp, Flag, Camera, Send, Loader2, Clock, MessageSquare, Image as ImageIcon, Trash2, SwitchCamera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../../translations';
import io from 'socket.io-client';

// --- CONFIGURATION ---
const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return "http://localhost:5000";
  }
  return `http://${window.location.hostname}:5000`;
};

const API_URL = getBaseUrl();
const socket = io.connect(API_URL, {
  transports: ['websocket'],
  reconnectionAttempts: 5
});

export const CommunityMap = ({ language }) => {
  const t = translations[language];
  const [reports, setReports] = useState([]); // Start empty, fetch from DB
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isReporting, setIsReporting] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  // Reporting Form State
  const [newReportType, setNewReportType] = useState('pest');
  const [newReportDescription, setNewReportDescription] = useState('');
  const [newReportImage, setNewReportImage] = useState(null);
  const [reportStatus, setReportStatus] = useState('idle');
  
  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const filteredReports = activeFilter === 'all' 
    ? reports 
    : reports.filter(r => r.type === activeFilter);

  // --- 1. FETCH & LISTEN (DATA LOADING) ---
  useEffect(() => {
    // A. Fetch existing reports from MongoDB
    const fetchReports = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reports`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data)) {
          setReports(data);
        }
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };
    fetchReports();

    // B. Listen for REAL-TIME updates
    const handleNewReport = (newReport) => {
      setReports((prev) => {
        if (prev.find(r => r._id === newReport._id)) return prev;
        return [newReport, ...prev];
      });
    };

    const handleReaction = (updatedReport) => {
        setReports((prevReports) => prevReports.map(report => 
            report._id === updatedReport._id ? updatedReport : report
        ));
        
        if (selectedReport && selectedReport._id === updatedReport._id) {
            setSelectedReport(updatedReport);
        }
    };

    socket.on("receive_report", handleNewReport);
    socket.on("receive_reaction", handleReaction);

    return () => {
        socket.off("receive_report", handleNewReport);
        socket.off("receive_reaction", handleReaction);
    };
  }, [selectedReport]);

  // --- 2. SUBMIT REPORT (SAVE TO DB) ---
  const handleSubmitReport = async () => {
    if (!newReportDescription.trim()) return;

    setReportStatus('submitting');

    const reportData = {
        type: newReportType,
        title: `${newReportType.charAt(0).toUpperCase() + newReportType.slice(1)} Alert`,
        reporter: 'Farmer', 
        severity: 'medium',
        description: newReportDescription,
        image: newReportImage,
        location: { lat: 0, lng: 0 } 
    };

    try {
        const response = await fetch(`${API_URL}/api/reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData)
        });

        const data = await response.json();

        if (response.ok) {
            setReportStatus('success');
            // UI update comes via Socket, but we clear form here
            setTimeout(() => {
                setIsReporting(false);
                setNewReportDescription('');
                setNewReportType('pest');
                setNewReportImage(null);
                setReportStatus('idle');
                setActiveFilter('all');
            }, 1500);
        } else {
            // Show the actual error message (e.g. "Payload Too Large")
            alert(`Submission Failed: ${data.message || "Unknown Error"}`);
            setReportStatus('idle');
        }
    } catch (err) {
        console.error(err);
        alert("Error connecting to server. Check your internet connection.");
        setReportStatus('idle');
    }
  };

  // --- 3. HANDLE REACTIONS ---
  const handleReaction = async (reportId, action) => {
      try {
          // Optimistic Update
          setReports(prev => prev.map(r => {
              if (r._id === reportId) {
                   const isConfirm = action === 'confirm';
                   return {
                       ...r,
                       confirmations: isConfirm ? (r.confirmations || 0) + 1 : (r.confirmations || 0),
                       userAction: action
                   };
              }
              return r;
          }));

          await fetch(`${API_URL}/api/reports/${reportId}/react`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action }) 
          });
      } catch (err) {
          console.error("Reaction error:", err);
      }
  };

  // --- CAMERA & UPLOAD FUNCTIONS ---
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: facingMode } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Could not access camera. Please allow permissions.");
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (isCameraActive) startCamera();
    return () => stopCameraStream();
  }, [facingMode, isCameraActive]);

  const stopCameraStream = () => {
     if (videoRef.current && videoRef.current.srcObject) {
       const tracks = videoRef.current.srcObject.getTracks();
       tracks.forEach(track => track.stop());
     }
  };

  const stopCamera = () => {
    stopCameraStream();
    setIsCameraActive(false);
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
      // Convert to Base64
      const imageUrl = canvas.toDataURL('image/jpeg', 0.7); // Compress slightly to 70% quality
      setNewReportImage(imageUrl);
      stopCamera();
    }
  };

  const toggleCamera = () => {
    stopCameraStream();
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          setNewReportImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewReportImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- HELPERS ---
  const getIcon = (type) => {
    switch(type) {
      case 'pest': return <Bug size={20} />;
      case 'disease': return <AlertTriangle size={20} />;
      case 'weather': return <CloudLightning size={20} />;
      default: return <ShieldAlert size={20} />;
    }
  };

  const getColor = (type, opacity = false) => {
    switch(type) {
      case 'pest': return opacity ? 'bg-red-50 text-red-600 border-red-200' : 'bg-red-500';
      case 'disease': return opacity ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-amber-500';
      case 'weather': return opacity ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-blue-500';
      case 'healthy': return opacity ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-emerald-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 w-full max-w-5xl mx-auto pb-24 md:pb-8">
       
       {/* Header Section */}
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 flex items-center gap-3">
            <Users className="text-emerald-600" size={32} />
            {t.communityTitle || "Community Alerts"} 
          </h2>
          <p className="text-slate-500 mt-1 text-sm md:text-base max-w-xl">
            {t.mapSub || "Connect with local farmers. Share alerts and stay protected together."}
          </p>
        </div>
        <button 
          onClick={() => setIsReporting(true)}
          className="w-full md:w-auto bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus size={20} />
          Report Issue
        </button>
      </div>

      {/* Main Feed Container */}
      <div className="flex flex-col gap-6">
        
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sticky top-0 z-20">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search alerts..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto no-scrollbar">
              {['all', 'pest', 'disease', 'weather'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap flex items-center gap-2 flex-shrink-0 ${
                    activeFilter === filter 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' 
                      : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {filter === 'all' && <Filter size={14} />}
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Feed List */}
        <div className="space-y-4">
          {filteredReports.length === 0 && (
              <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p>No reports yet. Be the first to report!</p>
              </div>
          )}
          
          {filteredReports.map((report, index) => (
            <motion.div 
              key={report._id || report.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => { setSelectedReport(report); setIsDetailsOpen(true); }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex justify-between items-start md:block">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${getColor(report.type, true)}`}>
                      {getIcon(report.type)}
                   </div>
                   <span className="md:hidden text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={12} /> {report.createdAt ? new Date(report.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : report.time}
                   </span>
                </div>

                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <div>
                         <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">{report.title}</h4>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getColor(report.type, true).replace('bg-', 'text-').replace('text-', 'border-')}`}>
                               {report.severity}
                            </span>
                         </div>
                         <p className="text-sm text-slate-600 leading-relaxed mb-3 line-clamp-2">{report.description}</p>
                      </div>
                      <span className="hidden md:flex text-xs text-slate-400 font-medium items-center gap-1 whitespace-nowrap">
                         <Clock size={14} /> {report.createdAt ? new Date(report.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : report.time}
                      </span>
                   </div>

                   <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-1">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">{(report.reporter || 'A').charAt(0)}</div>
                         <span className="text-xs font-semibold text-slate-600">{report.reporter || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-slate-400">
                         <span className={`text-xs flex items-center gap-1 ${report.userAction === 'confirm' ? 'text-emerald-600 font-bold' : ''}`}>
                            <ThumbsUp size={14} /> {report.confirmations || 0}
                         </span>
                         <ChevronRight size={16} className="text-slate-300" />
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- FULL DETAILS MODAL --- */}
      <AnimatePresence>
        {isDetailsOpen && selectedReport && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
             <motion.div 
               initial={{ opacity: 0, y: '100%' }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: '100%' }}
               className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-2xl max-h-[85vh] md:max-h-[90vh] shadow-2xl overflow-hidden flex flex-col"
             >
                <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                  <div className="flex items-center gap-3">
                      <div className={`p-2 md:p-3 rounded-xl border ${getColor(selectedReport.type, true)}`}>{getIcon(selectedReport.type)}</div>
                      <div className="min-w-0">
                         <h3 className="text-lg md:text-xl font-bold text-slate-800 truncate">{selectedReport.title}</h3>
                      </div>
                  </div>
                  <button onClick={() => setIsDetailsOpen(false)} className="p-2 bg-white rounded-full hover:bg-slate-100 border border-slate-200"><X size={20} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                   <div className="bg-slate-100 rounded-2xl aspect-video relative overflow-hidden group border border-slate-200 shrink-0">
                      {selectedReport.image ? (
                         <img src={selectedReport.image} alt="Evidence" className="w-full h-full object-contain bg-black" />
                      ) : (
                         <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-50">
                            <Camera size={48} className="opacity-20" />
                            <span className="ml-2 text-sm opacity-50">[No Image Attached]</span>
                         </div>
                      )}
                   </div>
                   <div>
                      <h4 className="text-sm font-bold text-slate-800 mb-2">Description</h4>
                      <p className="text-sm md:text-base text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">{selectedReport.description}</p>
                   </div>
                </div>
                <div className="p-4 border-t border-slate-100 flex gap-3 shrink-0 bg-white">
                   <button onClick={() => handleReaction(selectedReport._id || selectedReport.id, 'flag')} className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
                      <Flag size={16} /> Report
                   </button>
                   <button onClick={() => handleReaction(selectedReport._id || selectedReport.id, 'confirm')} className="flex-[2] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg">
                      <ThumbsUp size={16} /> Confirm ({selectedReport.confirmations || 0})
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- REPORT ISSUE MODAL --- */}
      <AnimatePresence>
        {isReporting && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4">
             <motion.div 
               initial={{ opacity: 0, y: '100%' }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: '100%' }}
               // FIX: Added max-h-[85vh] and flex-col to prevent cutting off on phones
               className="bg-white w-full md:w-[500px] rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col max-h-[85vh]"
             >
                {reportStatus === 'success' ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center p-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 animate-bounce"><CheckCircle size={40} strokeWidth={3} /></div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Report Submitted!</h3>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
                      <h3 className="text-xl font-bold text-slate-800">Report Issue</h3>
                      <button onClick={() => { setIsReporting(false); stopCamera(); }} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20} /></button>
                    </div>
                    
                    <div className="p-6 pb-32 space-y-6 overflow-y-auto">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Issue Type</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['pest', 'disease', 'weather'].map(type => (
                            <button key={type} onClick={() => setNewReportType(type)} className={`p-3 border rounded-xl flex flex-col items-center gap-2 transition-all ${newReportType === type ? 'bg-slate-800 border-slate-800 text-white' : 'bg-white hover:bg-slate-50'}`}>
                              {type === 'pest' && <Bug size={20} />}
                              {type === 'disease' && <AlertTriangle size={20} />}
                              {type === 'weather' && <CloudLightning size={20} />}
                              <span className="text-xs font-bold capitalize">{type}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Image Upload */}
                      <div>
                         <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Photo Evidence</label>
                         {isCameraActive ? (
                            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                               <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                               <canvas ref={canvasRef} className="hidden" />
                               <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6 z-20">
                                  <button onClick={stopCamera} className="bg-white/20 p-2 rounded-full text-white"><X size={20} /></button>
                                  <button onClick={capturePhoto} className="w-14 h-14 rounded-full border-4 border-white bg-white/20 flex items-center justify-center"><div className="w-10 h-10 bg-white rounded-full"></div></button>
                                  <button onClick={toggleCamera} className="bg-white/20 p-2 rounded-full text-white"><SwitchCamera size={20} /></button>
                               </div>
                            </div>
                         ) : newReportImage ? (
                            <div className="relative w-full h-40 rounded-xl overflow-hidden group border border-slate-200">
                               <img src={newReportImage} alt="Preview" className="w-full h-full object-contain bg-black" />
                               <button onClick={removeImage} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"><Trash2 size={20} /></button>
                            </div>
                         ) : (
                            <div className="grid grid-cols-2 gap-3">
                               <button onClick={() => fileInputRef.current.click()} className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-emerald-600 hover:border-emerald-200"><ImageIcon size={24} /><span className="text-xs font-bold">Upload</span></button>
                               <button onClick={startCamera} className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-600 hover:border-blue-200"><Camera size={24} /><span className="text-xs font-bold">Camera</span></button>
                            </div>
                         )}
                         <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Description</label>
                        <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 min-h-[120px]" value={newReportDescription} onChange={(e) => setNewReportDescription(e.target.value)} placeholder="Describe the issue..."></textarea>
                      </div>
                      
                      <button onClick={handleSubmitReport} disabled={!newReportDescription.trim() || reportStatus === 'submitting'} className="w-full py-4 font-bold rounded-xl shadow-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2">
                        {reportStatus === 'submitting' ? <><Loader2 size={20} className="animate-spin" /> Submitting...</> : <><Send size={20} /> Submit Report</>}
                      </button>
                    </div>
                  </>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};