import { useState, useEffect } from 'react';

interface BackgroundProps {
  videoSrc: string;
  isFixed?: boolean;
  playbackRate?: number;
  opacity?: number;
  className?: string;
  onLoaded?: () => void;
}

const Background = ({
  videoSrc,
  isFixed = true,
  playbackRate = 1.0,
  opacity = 1,
  className = "",
  onLoaded
}: BackgroundProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const handleVideoCanPlay = () => {
    setIsLoading(false);
    if (onLoaded) onLoaded();
  };

  useEffect(() => {
    if (isFixed) {
      document.body.style.overflow = 'hidden';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
    }

    return () => {
      if (isFixed) {
        document.body.style.overflow = 'auto';
        document.body.style.margin = '';
        document.body.style.padding = '';
      }
    };
  }, [isFixed]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const video = document.getElementById('background-video');
    if (video) {
      observer.observe(video);
    }

    return () => {
      if (video) {
        observer.unobserve(video);
      }
    };
  }, []);

  useEffect(() => {
    const video = document.getElementById('background-video') as HTMLVideoElement;
    if (video) {
      if (isVideoVisible) {
        try {
          video.play();
          video.defaultPlaybackRate = playbackRate;
          video.playbackRate = playbackRate;
        } catch {
          console.log('Automatyczne odtwarzanie zostało zablokowane przez przeglądarkę');
        }
      } else {
        video.pause();
      }
    }

    setVideoElement(video);
    return () => {
      if (video) {
        video.pause();
      }
    };
  }, [isVideoVisible, playbackRate]);

  const containerClasses = `${isFixed ? 'fixed inset-0' : 'relative w-full h-full'} ${className}`;
  const videoClasses = `object-cover w-full h-full ${opacity !== 1 ? `opacity-${Math.round(opacity * 100)}` : ''}`;

  return (
    <div className={containerClasses}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-xl">Ładowanie...</div>
        </div>
      )}

      <div className="absolute inset-0">
        <video
          id="background-video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className={videoClasses}
          onCanPlay={handleVideoCanPlay}
        >
          <source src={videoSrc} type="video/mp4" />
          Twoja przeglądarka nie obsługuje tagu video.
        </video>
      </div>
    </div>
  );
};

export default Background;