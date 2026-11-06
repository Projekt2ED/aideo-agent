import React, { useState } from 'react';
import { Play, Pause, Download, Maximize2, X } from 'lucide-react';

interface VideoPreviewProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}

export function VideoPreview({ src, poster, title, className = '' }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

  const handlePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFullscreen = () => {
    setIsFullscreen(true);
  };

  const handleCloseFullscreen = () => {
    setIsFullscreen(false);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = src;
    a.download = title || 'video.mp4';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div className={`relative rounded-lg overflow-hidden bg-black ${className}`}>
        <video
          ref={setVideoRef}
          src={src}
          poster={poster}
          className="w-full h-auto max-h-64 object-contain"
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
        
        {/* 控制栏 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-gray-300 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            
            <div className="flex-1" />
            
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Maximize2 size={18} />
            </button>
            
            <button
              onClick={handleDownload}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 全屏预览模态框 */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={handleCloseFullscreen}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
            <video
              src={src}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
            {title && (
              <div className="text-white text-center mt-2">{title}</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
