"use client";
import { useEffect, useRef } from "react";

export function Counter({ value }) {
  const ref = useRef(null);

  useEffect(() => {
    const end = parseInt(value);
    let current = 0;

    if (!ref.current || end === 0) {
      if (ref.current) ref.current.textContent = end;
      return;
    }

    const duration = 700;
    const stepTime = 20;
    const steps = Math.floor(duration / stepTime);

    const increment = end / steps;

    let tick = 0;

    const timer = setInterval(() => {
      tick++;
      current += increment;

      if (ref.current) {
        ref.current.textContent = Math.floor(current);
      }

      if (tick >= steps) {
        if (ref.current) ref.current.textContent = end;
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <span ref={ref}>0</span>;
}

export default Counter;
