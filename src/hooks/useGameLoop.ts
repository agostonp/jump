import { useEffect, useRef, useCallback } from 'react';

export function useGameLoop(
  callback: (currentTime: number) => void,
  isRunning: boolean
) {
  const requestRef = useRef<number | undefined>(undefined);
  const callbackRef = useRef<(currentTime: number) => void>(callback);

  // Update callback ref when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const animate = useCallback((time: number) => {
    callbackRef.current(time);
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [isRunning, animate]);
}
