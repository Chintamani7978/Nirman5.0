import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FileUpload = ({ 
  label, 
  accept = "image/*",
  onFileSelect 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    if (onFileSelect) onFileSelect(file);
  };

  const clearFile = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = '';
    // if (onFileSelect) onFileSelect(null); 
  };

  return (
    <div className="w-full h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`flex-1 relative border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer group min-h-[300px] ${
              isDragging 
                ? 'border-emerald-500 bg-emerald-50' 
                : 'border-slate-300 bg-slate-50 hover:border-emerald-400 hover:bg-emerald-50/30'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={inputRef}
              className="hidden" 
              accept={accept}
              onChange={handleChange}
            />
            
            <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-200 transition-all duration-300 shadow-sm">
              <UploadCloud size={40} />
            </div>
            
            <h4 className="text-xl font-bold text-slate-800 mb-2">{label}</h4>
            <p className="text-slate-500 mb-6 max-w-xs text-sm">Drag and drop your image here, or click to browse files</p>
            
            <span className="px-6 py-2.5 bg-white text-emerald-700 rounded-xl font-medium border border-slate-200 shadow-sm group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all flex items-center gap-2">
              <ImageIcon size={18} />
              Browse Files
            </span>
            
            <div className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-200/50 px-3 py-1 rounded-full border border-slate-200">
              Supports: JPG, PNG, WEBP
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 group h-full min-h-[300px]"
          >
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10 backdrop-blur-sm">
               <button 
                 onClick={(e) => { e.stopPropagation(); clearFile(); }}
                 className="bg-red-500 p-4 rounded-full text-white hover:bg-red-600 transition-all transform hover:scale-110 shadow-lg"
               >
                 <X size={32} />
               </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 text-center border border-white shadow-lg z-10">
              <p className="text-base font-bold text-emerald-700">Image Ready</p>
              <p className="text-xs text-slate-500">Click action button to proceed</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};