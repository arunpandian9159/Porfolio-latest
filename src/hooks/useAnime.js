import { useEffect, useRef } from 'react';

export const useAnimeOnView = (animationConfig, options = {}) => {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    
    // Dynamic import to handle anime.js v4
    import('animejs').then(({ animate }) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true;
              animate(element, animationConfig);
              if (!options.repeat) {
                observer.unobserve(element);
              }
            }
          });
        },
        { threshold: options.threshold || 0.1 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    });
  }, [animationConfig, options]);

  return ref;
};

export const useCountUp = (targetValue, duration = 2000) => {
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    import('animejs').then(({ animate }) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated.current) {
              hasAnimated.current = true;
              const obj = { value: 0 };
              animate(obj, {
                value: targetValue,
                duration,
                easing: 'easeInOutExpo',
                update: () => {
                  element.textContent = Math.round(obj.value);
                },
              });
              observer.unobserve(element);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    });
  }, [targetValue, duration]);

  return ref;
};
