import * as React from "react";
import * as d3 from "d3";

import { useDimensionsContext } from "./ChartProvider";

import type { BoundedDimensions } from "../types";

import styles from "./styles/Axis.module.css";

const formatNumber = d3.format(",");

type FormatTickFunction = ((n: number) => string) | ((date: Date) => string);

interface BaseAxisProps {
  dimension: "x" | "y";
  scale:
    | d3.ScaleTime<number, number, never>
    | d3.ScaleLinear<number, number, never>;
  formatTick?: FormatTickFunction;
  label?: string;
  numberOfTicks?: number;
  lineClassName?: string;
  tickClassName?: string;
  labelClassName?: string;
}
function Axis({
  dimension = "x",
  scale,
  formatTick = formatNumber,
  label = "",
  numberOfTicks,
  lineClassName = "",
  tickClassName = "",
  labelClassName = "",
  ...props
}: BaseAxisProps) {
  const dimensions = useDimensionsContext();

  switch (dimension) {
    case "x":
      return (
        <AxisHorizontal
          scale={scale}
          formatTick={formatTick}
          dimensions={dimensions}
          label={label}
          numberOfTicks={numberOfTicks}
          lineClassName={lineClassName}
          tickClassName={tickClassName}
          labelClassName={labelClassName}
          {...props}
        />
      );
    case "y":
      return (
        <AxisVertical
          scale={scale}
          formatTick={formatTick}
          dimensions={dimensions}
          label={label}
          numberOfTicks={numberOfTicks}
          lineClassName={lineClassName}
          tickClassName={tickClassName}
          labelClassName={labelClassName}
          {...props}
        />
      );
    default:
      throw new Error("Please specify x or y dimension!");
  }
}

interface AxisProps extends Omit<BaseAxisProps, "dimension"> {
  dimensions: BoundedDimensions;
  formatTick: FormatTickFunction;
}

function AxisHorizontal({
  dimensions,
  label,
  formatTick,
  scale,
  numberOfTicks,
  lineClassName,
  tickClassName,
  labelClassName,
  ...props
}: AxisProps) {
  //? Let's aim for one tick per 100 pixels for small screens
  //? and one tick per 250 pixels for wider screens
  // const numberOfTicks =
  //   dimensions.boundedWidth < 600
  //     ? dimensions.boundedWidth / 100
  //     : dimensions.boundedWidth / 250;
  // const ticks = scale.ticks(numberOfTicks);
  const ticks = scale.ticks(numberOfTicks);

  return (
    <g
      className="Axis AxisHorizontal"
      {...props}
      fontSize="12"
      transform={`translate(0, ${dimensions.boundedHeight})`}
    >
      <line
        className={[styles.axisLine, lineClassName].join(" ")}
        x2={dimensions.boundedWidth}
      />
      {ticks.map((tick, i) => (
        <g
          key={i}
          className={[styles.axisTick, tickClassName].join(" ")}
          transform={`translate(${scale(tick)}, 0)`}
        >
          <line stroke="white" y2={6} />
          <text className={styles.axisTickHorizontal} y={9} dy="0.71em">
            {formatTick(tick as number & Date)}
          </text>
        </g>
      ))}
      {label ? (
        <text
          className={[styles.axisLabel, labelClassName].join(" ")}
          transform={`translate(${dimensions.boundedWidth / 2}, ${
            dimensions.marginBottom! - 10
          })`}
          textAnchor="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function AxisVertical({
  dimensions,
  label,
  formatTick,
  scale,
  numberOfTicks,
  lineClassName,
  tickClassName,
  labelClassName,
  ...props
}: AxisProps) {
  // const numberOfTicks = dimensions.boundedHeight / 70;
  // const ticks = scale.ticks(numberOfTicks);
  const ticks = scale.ticks(numberOfTicks);

  return (
    <g className="Axis AxisVertical" {...props} fontSize="12">
      <line
        className={[styles.axisLine, lineClassName].join(" ")}
        y2={dimensions.boundedHeight}
      />
      {ticks.map((tick, i) => (
        <g
          key={i}
          className={tickClassName}
          transform={`translate(0, ${scale(tick)})`}
        >
          <line stroke="white" x2={-6} />
          <text className={styles.axisTickVertical} x={-9}>
            {formatTick(tick as number & Date)}
          </text>
        </g>
      ))}
      {label ? (
        <text
          className={[styles.axisLabel, labelClassName].join(" ")}
          transform={`translate(${-dimensions.marginLeft! + 20}, ${
            dimensions.boundedHeight / 2
          }) rotate(-90)`}
          textAnchor="middle"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

export default Axis;
