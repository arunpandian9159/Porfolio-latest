import { memo, useRef, useState, useEffect, useCallback } from "react";

/**
 * VideoPreview component with lazy loading and auto-play on hover
 * Falls back to poster image if video is unavailable
 */
const VideoPreview = memo(({ 
  videoSrc, 
  posterSrc, 
  alt = "Video preview",
  onExpand,
  className = "" 
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !videoSrc) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(container);
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [videoSrc]);

  // Handle video load
  const handleVideoLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  // Handle video error
  const handleVideoError = useCallback(() => {
    setHasError(true);
    setIsLoaded(false);
  }, []);

  // Auto-play on hover
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    if (videoRef.current && isLoaded && !hasError) {
      videoRef.current.play().catch(() => {
        // Silently handle autoplay failures
      });
    }
  }, [isLoaded, hasError]);

  // Pause on mouse leave
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, []);

  // Handle click to expand
  const handleClick = useCallback(() => {
    if (onExpand && videoSrc && !hasError) {
      onExpand();
    }
  }, [onExpand, videoSrc, hasError]);

  // If no video source or error, just show the poster image
  if (!videoSrc || hasError) {
    return (
      <div 
        ref={containerRef}
        className={`relative w-full h-full overflow-hidden ${className}`}
      >
        <img
          src={posterSrc}
          alt={alt}
          className="w-full h-full object-cover object-top-left"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden cursor-pointer group ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Play video preview: ${alt}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Poster image (shown until video loads or as fallback) */}
      <img
        src={posterSrc}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover object-top-left transition-opacity duration-300 ${
          isLoaded && isHovering ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Video element (lazy loaded) */}
      {isVisible && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover object-top-left transition-opacity duration-300 ${
            isLoaded && isHovering ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Play icon overlay */}
      <div 
        className={`absolute inset-0 flex items-center justify-center bg-oxford-navy/30 transition-opacity duration-300 ${
          isHovering ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-16 h-16 rounded-full bg-punch-red/90 flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
          <i className="fas fa-play text-honeydew text-xl ml-1" aria-hidden="true"></i>
        </div>
      </div>

      {/* Expand hint on hover */}
      {onExpand && isHovering && isLoaded && (
        <div className="absolute bottom-4 right-4 bg-oxford-navy/80 text-honeydew px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 animate-fade-in">
          <i className="fas fa-expand" aria-hidden="true"></i>
          <span>Click to expand</span>
        </div>
      )}
    </div>
  );
});

VideoPreview.displayName = "VideoPreview";

export default VideoPreview;
