import * as d3 from 'd3';

import Chart from './Chart/Chart';
import Axis from './Chart/Axis';
import { useChartDimensions } from './Chart/utils';
import type { ScatterPlotData } from '../utils/types';

function ScatterPlot({
  dataset,
  xAccessor,
  yAccessor,
  xLabel,
  yLabel,
}: {
  dataset: ScatterPlotData[];
  xAccessor: (d: ScatterPlotData) => number;
  yAccessor: (d: ScatterPlotData) => number;
  xLabel?: string;
  yLabel?: string;
  xNumberOfTicks?: number;
  yNumberOfTicks?: number;
}) {
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 80,
  });

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor) as [number, number])
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor) as [number, number])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xAccessorScaled = (d: ScatterPlotData) => xScale(xAccessor(d));
  const yAccessorScaled = (d: ScatterPlotData) => yScale(yAccessor(d));
  const keyAccessor = (_: ScatterPlotData, i: number) => i;

  const colorScale = d3
    .scaleSequential()
    .domain(d3.extent(dataset, xAccessor) as [number, number])
    //? Protip: Invert a color scheme with this one neat trick
    .interpolator((d) => d3.interpolateRainbow(-d));

  const colorAccessorScaled = (d: ScatterPlotData) =>
    colorScale(yAccessorScaled(d));

  return (
    <div className="ScatterPlot" ref={ref}>
      <Chart dimensions={dimensions}>
        <Axis dimension="x" scale={xScale} label={xLabel} />
        <Axis dimension="y" scale={yScale} label={yLabel} />
        {dataset.map((d, i) => (
          <circle
            className="Circles__circle"
            key={keyAccessor(d, i)}
            cx={xAccessorScaled(d)}
            cy={yAccessorScaled(d)}
            r={4}
            style={{
              fill: colorAccessorScaled(d),
            }}
          />
        ))}
      </Chart>
    </div>
  );
}

export default ScatterPlot;
