'use client';
import * as React from 'react';

import type { BoundedDimensions } from '../types';

interface ChartProps {
  dimensions: BoundedDimensions;
  className?: string;
  children?: React.ReactNode;
}

const ChartContext = React.createContext<BoundedDimensions>({
  width: 0,
  height: 0,
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  boundedWidth: 0,
  boundedHeight: 0,
  histogramHeight: 0,
  histogramMargin: 0,
  legendHeight: 0,
  legendWidth: 0,
});

export function useDimensionsContext() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error('useDimensionsContext must be used within a <Chart />');
  }
  return context;
}

//* Step 3. Draw canvas
function ChartProvider({ dimensions, className, children }: ChartProps) {
  return (
    <ChartContext.Provider value={dimensions}>
      <svg
        className={`Chart ${className ?? ''}`}
        width={dimensions.width}
        height={dimensions.height}
      >
        <g
          transform={`translate(${dimensions.marginLeft}, ${dimensions.marginTop})`}
        >
          {children}
        </g>
      </svg>
    </ChartContext.Provider>
  );
}

export default ChartProvider;
