import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll animations using Intersection Observer
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Margin around the root
 * @returns {Object} - ref to attach to element and isVisible state
 */
const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update state when intersection status changes
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once element is visible, stop observing
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '0px',
        ...options
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options]);

  return { ref, isVisible };
};

export default useScrollAnimation; 