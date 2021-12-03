import { useCallback, useRef, useEffect, useReducer } from "react";

export const useAnimationFrame = (callback = () => {}) => {
  const frameRef = useRef(null);
  const cb = useCallback(() => {
    callback();
    frameRef.current = requestAnimationFrame(cb);
  }, [callback]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(cb);
    return () => {
      if (frameRef.current) {
        return cancelAnimationFrame(frameRef.current);
      }
    };
  }, [cb]);
};
