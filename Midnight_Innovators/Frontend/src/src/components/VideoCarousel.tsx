import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  category: string;
}

const VideoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const videos: VideoItem[] = [
    {
      id: '1',
      title: 'PM-KISAN Scheme Success Story',
      description: 'How direct benefit transfer is transforming farmers\' lives across India',
      thumbnail: 'https://images.pexels.com/photos/442067/pexels-photo-442067.jpeg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-agricultural-field-and-farmhouse-aerial-view-28450-large.mp4',
      category: 'Government Schemes'
    },
    {
      id: '2',
      title: 'Digital Agriculture Revolution',
      description: 'Technology-driven farming techniques increasing crop yield by 40%',
      thumbnail: 'https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-green-agricultural-field-aerial-view-28451-large.mp4',
      category: 'Technology'
    },
    {
      id: '3',
      title: 'Sustainable Farming Practices',
      description: 'Organic farming methods and environmental conservation in agriculture',
      thumbnail: 'https://images.pexels.com/photos/265216/pexels-photo-265216.jpeg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wheat-field-in-the-countryside-4075-large.mp4',
      category: 'Sustainability'
    },
    {
      id: '4',
      title: 'Crop Insurance Benefits',
      description: 'Protecting farmers against natural calamities and crop loss',
      thumbnail: 'https://images.pexels.com/photos/1595385/pexels-photo-1595385.jpeg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-agricultural-field-from-above-28438-large.mp4',
      category: 'Insurance'
    },
    {
      id: '5',
      title: 'Women in Agriculture',
      description: 'Empowering women farmers through skill development and support',
      thumbnail: 'https://images.pexels.com/photos/2889688/pexels-photo-2889688.jpeg',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-person-working-on-a-farm-4076-large.mp4',
      category: 'Empowerment'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    setIsPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) {
        nextSlide();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef) {
      videoRef.load();
      setIsPlaying(false);
    }
  }, [currentIndex]);

  const currentVideo = videos[currentIndex];

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Main Video Display */}
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="aspect-video relative">
          <video
            ref={setVideoRef}
            className="w-full h-full object-cover"
            poster={currentVideo.thumbnail}
            muted={isMuted}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={currentVideo.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="mb-2">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentVideo.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2">{currentVideo.title}</h3>
              <p className="text-lg opacity-90 max-w-2xl">{currentVideo.description}</p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={togglePlay}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleMute}
              className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-6 flex space-x-4 overflow-x-auto pb-2">
        {videos.map((video, index) => (
          <button
            key={video.id}
            onClick={() => {
              setCurrentIndex(index);
              setIsPlaying(false);
            }}
            className={`relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden transition-all duration-300 ${
              index === currentIndex 
                ? 'ring-4 ring-green-500 scale-105' 
                : 'hover:scale-105 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              {index === currentIndex && isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-green-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;