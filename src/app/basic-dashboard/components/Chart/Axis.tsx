import * as d3 from 'd3';
import { useDimensionsContext } from './Chart';
import { BoundedDimensions } from '../../utils/types';

interface BaseAxisProps {
  dimension: 'x' | 'y';
  scale:
    | d3.ScaleTime<number, number, never>
    | d3.ScaleLinear<number, number, never>;
  label?: string;
  formatTick?: (tick: number | { valueOf(): number }) => string;
}

function Axis({
  dimension = 'x',
  scale,
  formatTick = d3.format(','),
  label = '',
  ...props
}: BaseAxisProps) {
  const dimensions = useDimensionsContext() as BoundedDimensions;

  return (
    <>
      {dimension === 'x' ? (
        <AxisHorizontal
          scale={scale}
          formatTick={formatTick}
          dimensions={dimensions}
          label={label}
          {...props}
        />
      ) : (
        <AxisVertical
          scale={scale}
          formatTick={formatTick}
          dimensions={dimensions}
          label={label}
          {...props}
        />
      )}
    </>
  );
}

interface AxisProps extends Omit<BaseAxisProps, 'dimension'> {
  dimensions: BoundedDimensions;
  formatTick?: (tick: number | { valueOf(): number }) => string;
}

export default Axis;

function AxisHorizontal({
  dimensions,
  label,
  formatTick = d3.format(','),
  scale,
  ...props
}: AxisProps) {
  // if chart is less than 600px wide, show 1 tick per 100px, otherwise 1 tick per 250px
  const numberOfTicks =
    dimensions.boundedWidth < 600
      ? dimensions.boundedWidth / 100
      : dimensions.boundedWidth / 250;

  const ticks = scale.ticks(numberOfTicks);

  return (
    <g
      className="Axis AxisHorizontal"
      transform={`translate(0, ${dimensions.boundedHeight})`}
      {...props}
    >
      <line className="Axis__line" x2={dimensions.boundedWidth} />

      {ticks.map((tick) => (
        <text
          key={tick as number & Date}
          className="Axis__tick"
          transform={`translate(${scale(tick)}, 25)`}
        >
          {formatTick(tick)}
          {/* some function that creates text based on the data passed in 'e.g. d3.timeFormat' */}
        </text>
      ))}
      <text
        className="Axis__label"
        transform={`translate(${dimensions.boundedWidth / 2}, 60)`}
      >
        {label}
      </text>
    </g>
  );
}

function AxisVertical({
  dimensions,
  label,
  formatTick = d3.format(','),
  scale,
  ...props
}: AxisProps) {
  const numberOfTicks = dimensions.boundedHeight / 70;

  const ticks = scale.ticks(numberOfTicks);

  return (
    <g className="Axis AxisVertical" {...props}>
      <line className="Axis__line" y2={dimensions.boundedHeight} />

      {ticks.map((tick) => (
        <text
          key={tick as number & Date}
          className="Axis__tick"
          transform={`translate(-16, ${scale(tick)})`}
        >
          {formatTick(tick as number & Date)}
        </text>
      ))}
      <text
        className="Axis__label"
        style={{
          transform: `translate(-56px, ${
            dimensions.boundedHeight / 2
          }px) rotate(-90deg)`,
        }}
      >
        {label}
      </text>
    </g>
  );
}
