import * as d3 from "d3"

import Chart from "./Chart/Chart"
import Line from "./Chart/Line"
import Axis from "./Chart/Axis"
import Gradient from "./Chart/Gradient";
import { useChartDimensions } from "./Chart/utils"
import { TimelineData } from "../utils/types"

function Timeline({ dataset, xAccessor, yAccessor, label }: {
  dataset: TimelineData[];
  xAccessor: (d: TimelineData) => Date;
  yAccessor: (d: TimelineData) => number;
  label?: string;
}) {
  const [ref, dimensions] = useChartDimensions({
    // marginBottom: 80,
  })
  const gradientId = "Timeline-gradient"

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor) as [Date, Date])
    .range([0, dimensions.boundedWidth])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor) as [number, number])
    .range([dimensions.boundedHeight, 0])
    .nice()

  const xAccessorScaled = (d: TimelineData) => xScale(xAccessor(d));
  const yAccessorScaled = (d: TimelineData) => yScale(yAccessor(d));
  const y0AccessorScaled = () => yScale(yScale.domain()[0] as number)

  const tickFormat = (tick: number | { valueOf(): number }): string =>
    tick instanceof Date ? tick.toLocaleDateString() : tick.toString();

  return (
    <div className="Timeline" ref={ref}>
      <Chart dimensions={dimensions}>
        <defs>
          <Gradient
            id={gradientId}
            colors={["#9980FA", "rgb(226, 222, 243)"]}
            x2="0"
            y2="100%"
          />
        </defs>
        <Axis
          dimension="x"
          scale={xScale}
          formatTick={tickFormat}
        />
        <Axis
          dimension="y"
          scale={yScale}
          label={label}
        />
        <Line
          type="area"
          data={dataset}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
          y0Accessor={y0AccessorScaled}
          style={{ fill: `url(#${gradientId})` }}
        />
        <Line
          data={dataset}
          xAccessor={xAccessorScaled}
          yAccessor={yAccessorScaled}
        />
      </Chart>
    </div>
  )
}

export default Timeline
