import { useState, useRef, useEffect } from 'react';

export const useChartDimensions = (dimensions: {
  width?: number;
  height?: number;
}): [React.RefObject<HTMLDivElement>, { width: number; height: number }] => {
  const ref = useRef<HTMLDivElement>(null);

  const [width, changeWidth] = useState(0);
  const [height, changeHeight] = useState(0);

  useEffect(() => {
    if (dimensions.width && dimensions.height) return;

    const element = ref.current;

    function handleResize() {
      if (!element) return;
      changeWidth(element.offsetWidth);
      changeHeight(element.offsetHeight);
    }

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [dimensions]);

  const newDimensions = {
    width: dimensions.width ?? width,
    height: dimensions.height ?? height,
  };

  return [ref, newDimensions];
};
