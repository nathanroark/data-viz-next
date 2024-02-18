import * as d3 from 'd3';

import Chart from './Chart/Chart';
import Axis from './Chart/Axis';
import Gradient from './Chart/Gradient';
import { useChartDimensions } from './Chart/utils';
import type { HistogramData } from '../utils/types';
import useHasMounted from '../utils/useHasMounted';
function Histogram({
  dataset,
  xAccessor,
  label,
}: {
  dataset: HistogramData[];
  xAccessor: (d: HistogramData) => number;
  label: string;
}) {
  const gradientId = 'Histogram-gradient';
  const [ref, dimensions] = useChartDimensions({
    marginBottom: 77,
  });

  const numberOfThresholds = 9;

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor) as [number, number])
    .range([0, dimensions.boundedWidth])
    .nice(numberOfThresholds);

  const binsGenerator = d3
    .bin<HistogramData, number>()
    .domain(xScale.domain() as [number, number])
    .value(xAccessor)
    .thresholds(xScale.ticks(numberOfThresholds));

  const bins = binsGenerator(dataset);

  type DataBin = (typeof bins)[number];

  const yAccessor = (bin: DataBin) => bin.length;

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(bins, yAccessor)] as [0, number])
    .range([dimensions.boundedHeight, 0])
    .nice();

  const xAccessorScaled = (bin: DataBin) => xScale(bin.x0 as number) + barPadding;
  const yAccessorScaled = (bin: DataBin) => yScale(yAccessor(bin));
  const widthAccessorScaled = (bin: DataBin) =>
    xScale(bin.x1 as number) - xScale(bin.x0 as number) - barPadding;
  const heightAccessorScaled = (bin: DataBin) => dimensions.boundedHeight - yScale(yAccessor(bin));
  const callAccessor = (
    accessor: (bin: d3.Bin<HistogramData, number>) => number,
    d: d3.Bin<HistogramData, number>,
  ) => (typeof accessor === 'function' ? accessor(d) : accessor);
  const keyAccessor = (_: DataBin, i: number) => i;

  const barPadding = 2;
  const gradientColors = ['#9980FA', 'rgb(226, 222, 243)'];

  return (
    <div className="Histogram" ref={ref}>
      <Chart dimensions={dimensions}>
        <defs>
          <Gradient id={gradientId} colors={gradientColors} x2="0" y2="100%" />
        </defs>
        <Axis dimension="x" scale={xScale} label={label} />
        <Axis dimension="y" scale={yScale} label="Count" />
        {useHasMounted() && (
          <>
            {bins.map((d, i) => (
              <rect
                key={keyAccessor(d, i)}
                style={{ fill: `url(#${gradientId})` }}
                className="Bars__rect"
                x={callAccessor(xAccessorScaled, d)}
                y={callAccessor(yAccessorScaled, d)}
                width={d3.max([callAccessor(widthAccessorScaled, d), 0])}
                height={d3.max([callAccessor(heightAccessorScaled, d), 0])}
              />
            ))}
          </>
        )}
      </Chart>
    </div>
  );
}

export default Histogram;
