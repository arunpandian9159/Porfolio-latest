import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { animate, stagger } from 'animejs';

const LOADER_NAME = 'ARUN';

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null);
  const progressRef = useRef(null);
  const letterRefs = useRef([]);
  const [isHidden, setIsHidden] = useState(false);
  const hasRun = useRef(false);

  // Memoize letters array to avoid recreating on each render
  const letters = useMemo(() => LOADER_NAME.split(''), []);

  // Store refs for letters
  const setLetterRef = useCallback((index) => (el) => {
    letterRefs.current[index] = el;
  }, []);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const letterElements = letterRefs.current.filter(Boolean);
    const progress = progressRef.current;

    if (!letterElements.length || !progress) return;

    // Use requestAnimationFrame to batch animations and avoid forced reflows
    requestAnimationFrame(() => {
      // Step 1: Animate letters with bounce effect (0ms - 800ms)
      animate(letterElements, {
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.5, 1.1, 1],
        rotate: [-15, 0],
        delay: stagger(120),
        duration: 600,
        easing: 'easeOutElastic(1, .6)'
      });

      // Step 2: Glow pulse on letters (starts at 800ms)
      setTimeout(() => {
        animate(letterElements, {
          textShadow: [
            '0 0 20px rgba(230, 57, 70, 0.5)',
            '0 0 60px rgba(230, 57, 70, 1)',
            '0 0 20px rgba(230, 57, 70, 0.5)'
          ],
          duration: 800,
          easing: 'easeInOutSine'
        });
      }, 800);

      // Step 3: Animate progress bar (starts at 300ms, runs for 1500ms)
      setTimeout(() => {
        animate(progress, {
          width: '100%',
          duration: 1500,
          easing: 'easeInOutQuart'
        });
      }, 300);

      // Step 4: Exit animation - letters fly out (at 2200ms)
      setTimeout(() => {
        animate(letterElements, {
          opacity: [1, 0],
          translateY: [0, -50],
          scale: [1, 1.5],
          delay: stagger(60, { from: 'center' }),
          duration: 400,
          easing: 'easeOutExpo'
        });
      }, 2200);

      // Step 5: Fade out loader (at 2400ms)
      setTimeout(() => {
        if (loaderRef.current) {
          animate(loaderRef.current, {
            opacity: [1, 0],
            duration: 500,
            easing: 'easeOutQuart'
          });
        }
      }, 2400);

      // Step 6: Hide and callback (at 3000ms = 3 seconds total)
      setTimeout(() => {
        setIsHidden(true);
        onComplete?.();
      }, 3000);
    });
  }, [onComplete]);

  if (isHidden) return null;

  return (
    <div ref={loaderRef} className="loader">
      <div className="text-center relative z-10">
        <div className="flex gap-3 justify-center mb-10">
          {letters.map((letter, i) => (
            <span 
              key={i} 
              ref={setLetterRef(i)} 
              className="loader-letter"
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="w-64 h-2 bg-oxford-navy/50 rounded-full overflow-hidden mx-auto border border-frosted-blue/20">
          <div ref={progressRef} className="loader-progress h-full"></div>
        </div>
        <p className="text-frosted-blue/60 text-sm mt-5 tracking-widest uppercase">Loading Portfolio...</p>
      </div>
    </div>
  );
};

export default Loader;

