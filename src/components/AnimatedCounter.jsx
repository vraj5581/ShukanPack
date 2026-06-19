import { useState, useEffect, useRef } from "react";

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function AnimatedCounter({ value, suffix = "", duration = 1800 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const targetValue = parseInt(value, 10);

    if (isNaN(targetValue)) {
      setCount(value);
      return;
    }

    // Adjust duration for smaller values to prevent stuttering/slowness
    const adjustedDuration = Math.min(duration, Math.max(800, targetValue * 40));

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let startTimestamp = null;

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const elapsed = timestamp - startTimestamp;
            const progress = Math.min(elapsed / adjustedDuration, 1);
            
            // Apply ease-out-cubic curve
            const easedProgress = easeOutCubic(progress);
            setCount(Math.floor(easedProgress * targetValue));

            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(targetValue);
            }
          };

          window.requestAnimationFrame(step);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [value, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

export default AnimatedCounter;
