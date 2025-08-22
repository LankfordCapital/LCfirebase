'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface VideoModule {
  id: string;
  title: string;
  videoUrl: string;
  description?: string;
  nextModuleId?: string;
  prevModuleId?: string;
  autoPlay?: boolean;
}

interface FullscreenVideoModuleProps {
  modules: VideoModule[];
  initialModuleId: string;
  onClose?: () => void;
  className?: string;
}

export function FullscreenVideoModule({ 
  modules, 
  initialModuleId, 
  onClose,
  className = "" 
}: FullscreenVideoModuleProps) {
  const [currentModuleId, setCurrentModuleId] = useState(initialModuleId);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  const currentModule = modules.find(m => m.id === currentModuleId);
  const currentIndex = modules.findIndex(m => m.id === currentModuleId);
  const hasNext = currentIndex < modules.length - 1;
  const hasPrev = currentIndex > 0;

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle video time updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [currentModuleId]);

  // Auto-play if specified
  useEffect(() => {
    if (currentModule?.autoPlay && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [currentModuleId, currentModule?.autoPlay]);

  // Enter fullscreen
  const enterFullscreen = async () => {
    try {
      if (containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  };

  // Exit fullscreen
  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(console.error);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Navigate to next module
  const goToNext = () => {
    if (hasNext) {
      const nextModule = modules[currentIndex + 1];
      setCurrentModuleId(nextModule.id);
      
      // Reset video state
      setCurrentTime(0);
      setIsPlaying(false);
      
      // If we're in fullscreen, maintain it
      if (isFullscreen && containerRef.current) {
        setTimeout(() => {
          if (containerRef.current && !document.fullscreenElement) {
            enterFullscreen();
          }
        }, 100);
      }
    }
  };

  // Navigate to previous module
  const goToPrev = () => {
    if (hasPrev) {
      const prevModule = modules[currentIndex - 1];
      setCurrentModuleId(prevModule.id);
      
      // Reset video state
      setCurrentTime(0);
      setIsPlaying(false);
      
      // If we're in fullscreen, maintain it
      if (isFullscreen && containerRef.current) {
        setTimeout(() => {
          if (containerRef.current && !document.fullscreenElement) {
            enterFullscreen();
          }
        }, 100);
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (event.key) {
        case 'ArrowRight':
        case ' ':
          event.preventDefault();
          if (event.key === ' ') {
            togglePlay();
          } else {
            goToNext();
          }
          break;
        case 'ArrowLeft':
          event.preventDefault();
          goToPrev();
          break;
        case 'Escape':
          event.preventDefault();
          exitFullscreen();
          break;
        case 'm':
          event.preventDefault();
          toggleMute();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, currentIndex, hasNext, hasPrev, isPlaying, isMuted]);

  if (!currentModule) {
    return <div>Module not found</div>;
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-black text-white ${className}`}
    >
      {/* Fullscreen Controls */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        {isFullscreen ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={exitFullscreen}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={enterFullscreen}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        )}
        
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Video Player */}
      <div className="w-full h-full flex flex-col">
        {/* Module Header */}
        <div className="flex-shrink-0 p-6 border-b border-white/20">
          <h1 className="text-2xl font-bold">{currentModule.title}</h1>
          {currentModule.description && (
            <p className="text-white/70 mt-2">{currentModule.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 text-sm text-white/70">
            <span>Module {currentIndex + 1} of {modules.length}</span>
            {currentModule.id && <span>• {currentModule.id}</span>}
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 relative">
          <video
            ref={videoRef}
            src={currentModule.videoUrl}
            className="w-full h-full object-contain"
            playsInline
            muted={isMuted}
            onEnded={goToNext}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              
              <div className="flex-1 text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex-shrink-0 p-6 border-t border-white/20">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={goToPrev}
              disabled={!hasPrev}
              className="border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {modules.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              onClick={goToNext}
              disabled={!hasNext}
              className="border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Fullscreen Instructions */}
      {!isFullscreen && (
        <div className="absolute bottom-20 left-4 text-sm text-white/70 bg-black/50 px-3 py-2 rounded">
          <p>Press F11 or click maximize to enter fullscreen</p>
          <p>Space: Play/Pause • M: Mute • Arrows: Navigate</p>
        </div>
      )}
    </div>
  );
}
