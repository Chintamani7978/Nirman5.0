import { useState, useEffect } from 'react';
import { Video, WifiOff, AlertCircle } from 'lucide-react';

interface StreamViewerProps {
  camera: {
    id: string;
    status: 'secure' | 'vulnerable';
    risk: 'critical' | 'high' | 'medium' | 'low';
  };
}

export function StreamViewer({ camera }: StreamViewerProps) {
  const [isStreaming, setIsStreaming] = useState(true);

  const riskColors = {
    critical: 'border-red-500 bg-red-500/10',
    high: 'border-orange-500 bg-orange-500/10',
    medium: 'border-yellow-500 bg-yellow-500/10',
    low: 'border-green-500 bg-green-500/10',
  };

  return (
    <div className={`relative rounded-lg border-2 overflow-hidden ${riskColors[camera.risk]}`}>
      <div className="aspect-video bg-[#1A120B] relative">
        {/* Simulated camera feed with grid overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'linear-gradient(rgba(213, 206, 163, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(213, 206, 163, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>
        
        {/* Animated scan line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#D5CEA3] to-transparent animate-scan"></div>
        </div>

        {/* Status indicator */}
        <div className="absolute top-2 left-2 flex items-center gap-2 bg-[#1A120B]/80 backdrop-blur-sm px-2 py-1 rounded">
          <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-xs text-[#E5E5CB]">{camera.id}</span>
        </div>

        {/* Risk badge */}
        <div className="absolute top-2 right-2 bg-[#1A120B]/80 backdrop-blur-sm px-2 py-1 rounded">
          <span className="text-xs text-[#D5CEA3] uppercase">{camera.risk}</span>
        </div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {camera.status === 'vulnerable' ? (
            <AlertCircle className="w-12 h-12 text-red-500 opacity-50" />
          ) : (
            <Video className="w-12 h-12 text-[#D5CEA3] opacity-50" />
          )}
        </div>

        {/* Bottom status bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-[#1A120B]/80 backdrop-blur-sm px-2 py-1">
          <div className="flex items-center justify-between text-xs">
            <span className={`${camera.status === 'vulnerable' ? 'text-red-400' : 'text-green-400'}`}>
              {camera.status === 'vulnerable' ? '⚠️ Vulnerable' : '✓ Secured'}
            </span>
            <span className="text-[#E5E5CB]/60">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
