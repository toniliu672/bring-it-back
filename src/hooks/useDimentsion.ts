import React from "react";
import { useRef } from "react";

export const useDimensions = (ref: React.RefObject<HTMLElement>) => {
    const dimensions = useRef({ width: 0, height: 0 });
  
    React.useEffect(() => {
      if (ref.current) {
        dimensions.current.width = ref.current.offsetWidth;
        dimensions.current.height = ref.current.offsetHeight;
      }
    }, [ref]);
  
    return dimensions.current;
  };