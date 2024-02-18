'use client';
import * as React from 'react';
import type { BoundedDimensions } from '../../utils/types';

import './Chart.css';

const ChartContext = React.createContext<BoundedDimensions>({
  width: 0,
  height: 0,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  boundedWidth: 0,
  boundedHeight: 0,
});

export const useDimensionsContext = () => React.useContext(ChartContext);

function Chart({
  dimensions,
  children,
}: {
  dimensions: BoundedDimensions;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <ChartContext.Provider value={dimensions}>
      <svg
        className="Chart"
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

export default Chart;
