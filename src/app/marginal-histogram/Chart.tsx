"use client";
import * as React from "react";
import * as d3 from "d3";

import ChartProvider from "./components/ChartProvider";
import Axis from "./components/Axis";
import { useChartDimensions } from "./components/utils";

import type { WeatherData } from "@/server/api/types";

//* Step 1b. Access Data
const xAccessor = (d: WeatherData) => d.temperatureMin;
const yAccessor = (d: WeatherData) => d.temperatureMax;

const colorScaleYear = 2000;
const parseDate = d3.timeParse("%Y-%m-%d") as (date: string) => Date;
//? Set all dates to be in the same year
//? We want to show the time of year, not the absolute date
const colorAccessor = (d: WeatherData) =>
  parseDate(d.date).setFullYear(colorScaleYear);

//* Step 2. Create chart dimensions
// const chartSize = d3.min([
//   window.innerWidth * 0.75,
//   window.innerHeight * 0.75,
// ]) as number;

type TooltipState = {
  show: boolean;
  coords: {
    x: number;
    y: number;
  };
  dot: {
    cx: number;
    cy: number;
  };
  formattedDate?: string;
  temperature?: {
    min: number;
    max: number;
  };
};

type TooltipAction =
  | {
      type: "SHOW";
      payload: Omit<TooltipState, "show">;
    }
  | { type: "HIDE" };

function tooltipReducer(state: TooltipState, action: TooltipAction) {
  switch (action.type) {
    case "HIDE":
      return { ...state, show: false };
    case "SHOW":
      return { ...state, show: true, ...action.payload };
  }
}

const hoverLineThickness = 10;

const getYear = (d: Date) => +d3.timeFormat("%Y")(d);
function isDayWithinRange(
  d: WeatherData,
  minDateToHighlight: Date,
  maxDateToHighlight: Date,
) {
  const date = colorAccessor(d);

  if (getYear(minDateToHighlight) < colorScaleYear) {
    // if dates wrap around to previous year,
    // check if this date is after the min date
    return (
      date >= new Date(minDateToHighlight).setFullYear(colorScaleYear) ||
      date <= maxDateToHighlight.valueOf()
    );
  } else if (getYear(maxDateToHighlight) > colorScaleYear) {
    // if dates wrap around to next year,
    // check if this date is before the max date
    return (
      date <= new Date(maxDateToHighlight).setFullYear(colorScaleYear) ||
      date >= minDateToHighlight.valueOf()
    );
  } else {
    return (
      date >= minDateToHighlight.valueOf() &&
      date <= maxDateToHighlight.valueOf()
    );
  }
}

const numberOfGradientStops = 10;
const stops = d3
  .range(numberOfGradientStops)
  .map((i) => i / (numberOfGradientStops - 1));
const legendGradientId = "legend-gradient";

const legendTickValues = [
  d3.timeParse("%m/%d/%Y")(`4/1/${colorScaleYear}`)!,
  d3.timeParse("%m/%d/%Y")(`7/1/${colorScaleYear}`)!,
  d3.timeParse("%m/%d/%Y")(`10/1/${colorScaleYear}`)!,
];

type LegendState = {
  show: boolean;
  minDateToHighlight: Date;
  maxDateToHighlight: Date;
  barX: number;
  histogramFill?: string;
  topHistogramPath?: string;
  rightHistogramPath?: string;
};

type LegendAction =
  | {
      type: "SHOW";
      payload: Omit<LegendState, "show">;
    }
  | { type: "HIDE" };

function legendReducer(state: LegendState, action: LegendAction) {
  switch (action.type) {
    case "HIDE":
      return { ...state, show: false };
    case "SHOW":
      return { ...state, show: true, ...action.payload };
  }
}

export default function MarginalHistogram({
  dataset,
}: {
  dataset: WeatherData[];
}) {
  const [ref, dimensions] = useChartDimensions({
    // width: 770,
    // height: 650,
    histogramMargin: 10,
    histogramHeight: 70,
    legendWidth: 250,
    legendHeight: 26,
  });

  const legendHighlightBarWidth = dimensions.legendWidth * 0.05;

  //* Step 4. Create scales
  //? We'll want to have equal domains for both axes
  const temperaturesExtent = d3.extent([
    ...dataset.map(xAccessor),
    ...dataset.map(yAccessor),
  ]) as [number, number];

  const xScale = d3
    .scaleLinear()
    .domain(temperaturesExtent)
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(temperaturesExtent)
    .range([dimensions.boundedHeight, 0])
    .nice();

  const timeParseLine = d3.timeParse("%m/%d/%Y") as (date: string) => Date;

  const colorScale = d3
    .scaleSequential()
    .domain([
      timeParseLine(`1/1/${colorScaleYear}`), // 1/1/2000
      timeParseLine(`12/31/${colorScaleYear}`), // 12/31/2000
    ])
    //? Protip: Invert a color scheme with this one neat trick
    .interpolator((d) => d3.interpolateRainbow(-d));

  const legendTickScale = d3
    .scaleLinear()
    .domain(colorScale.domain())
    .range([0, dimensions.legendWidth]);

  const topHistogramGenerator = d3
    .bin<WeatherData, number>()
    .domain(xScale.domain() as [number, number])
    .value(xAccessor)
    .thresholds(20);
  const topHistogramBins = topHistogramGenerator(dataset);
  const topHistogramYScale = d3
    .scaleLinear()
    .domain(d3.extent(topHistogramBins, (d) => d.length) as [number, number])
    .range([dimensions.histogramHeight, 0]);

  const rightHistogramGenerator = d3
    .bin<WeatherData, number>()
    .domain(yScale.domain() as [number, number])
    .value(yAccessor)
    .thresholds(20);
  const rightHistogramBins = rightHistogramGenerator(dataset);
  const rightHistogramYScale = d3
    .scaleLinear()
    .domain(d3.extent(rightHistogramBins, (d) => d.length) as [number, number])
    .range([dimensions.histogramHeight, 0]);

  const xAccessorScaled = (d: WeatherData) => xScale(xAccessor(d));
  const yAccessorScaled = (d: WeatherData) => yScale(yAccessor(d));
  const colorAccessorScaled = (d: WeatherData) => colorScale(colorAccessor(d));

  const topHistogramLineGenerator = d3
    .area<d3.Bin<WeatherData, number>>()
    .x((d) => xScale((d.x0! + d.x1!) / 2))
    .y0(dimensions.histogramHeight)
    .y1((d) => topHistogramYScale(d.length))
    .curve(d3.curveBasis);

  const rightHistogramLineGenerator = d3
    .area<d3.Bin<WeatherData, number>>()
    .x((d) => yScale((d.x0! + d.x1!) / 2))
    .y0(dimensions.histogramHeight)
    .y1((d) => rightHistogramYScale(d.length))
    .curve(d3.curveBasis);

  const delaunay = d3.Delaunay.from(dataset, xAccessorScaled, yAccessorScaled);
  const voronoi = delaunay.voronoi();
  voronoi.xmax = dimensions.boundedWidth;
  voronoi.ymax = dimensions.boundedHeight;

  //* Step 7a. Handle interactions
  const [tooltip, dispatchTooltip] = React.useReducer(tooltipReducer, {
    show: false,
    coords: {
      x: 0,
      y: 0,
    },
    dot: {
      cx: 0,
      cy: 0,
    },
  });

  function showTooltip(d: WeatherData) {
    const dateParser = d3.timeParse("%Y-%m-%d");
    const formatDate = d3.timeFormat("%A, %B %-d, %Y");

    const x = xAccessorScaled(d) + dimensions.marginLeft!;
    const y = yAccessorScaled(d) + dimensions.marginTop!;

    dispatchTooltip({
      type: "SHOW",
      payload: {
        coords: {
          x,
          y,
        },
        dot: {
          cx: xAccessorScaled(d),
          cy: yAccessorScaled(d),
        },
        formattedDate: formatDate(dateParser(d.date)!),
        temperature: {
          min: xAccessor(d),
          max: yAccessor(d),
        },
      },
    });
  }

  function hideTooltip() {
    dispatchTooltip({ type: "HIDE" });
  }

  const [legend, dispatchLegend] = React.useReducer(legendReducer, {
    show: false,
    minDateToHighlight: new Date(legendTickScale.invert(0)),
    maxDateToHighlight: new Date(
      legendTickScale.invert(legendHighlightBarWidth),
    ),
    barX: 0,
  });

  function onLegendMouseMove(event: React.MouseEvent) {
    const [x] = d3.pointer(event);

    const minDateToHighlight = new Date(
      legendTickScale.invert(x - legendHighlightBarWidth),
    );
    const maxDateToHighlight = new Date(
      legendTickScale.invert(x + legendHighlightBarWidth),
    );

    const barX = d3.median([
      0,
      x - legendHighlightBarWidth / 2,
      dimensions.legendWidth - legendHighlightBarWidth,
    ])!;

    // const hoveredDate = d3.isoParse(legendTickScale.invert(x));
    const hoveredDate = new Date(legendTickScale.invert(x));
    const hoveredDates = dataset.filter((d) =>
      isDayWithinRange(d, minDateToHighlight, maxDateToHighlight),
    );

    dispatchLegend({
      type: "SHOW",
      payload: {
        minDateToHighlight,
        maxDateToHighlight,
        barX,
        histogramFill: colorScale(hoveredDate),
        topHistogramPath: topHistogramLineGenerator(
          topHistogramGenerator(hoveredDates),
        )!,
        rightHistogramPath: rightHistogramLineGenerator(
          rightHistogramGenerator(hoveredDates),
        )!,
      },
    });
  }

  function onLegendMouseLeave() {
    dispatchLegend({ type: "HIDE" });
  }

  return (
    <div className="container relative flex flex-col items-center" ref={ref}>
      <h1 className="title">Daily Temperature Ranges</h1>
      <div className="description">
        Daily minimum and maximum temperatures in New York City in 2018
      </div>
      <div>
        {/* Step 3. Draw canvas */}
        <ChartProvider dimensions={dimensions}>
          <defs>
            <linearGradient id={legendGradientId}>
              {stops.map((d) => (
                <stop
                  key={d}
                  stopColor={d3.interpolateRainbow(-d)}
                  offset={`${d * 100}%`}
                />
              ))}
            </linearGradient>
          </defs>
          <rect
            className="boundsBackground"
            x={0}
            y={0}
            width={dimensions.boundedWidth}
            height={dimensions.boundedHeight}
          />
          {/* Step 5. Draw data */}
          {dataset?.map((data, idx) => (
            <React.Fragment key={data.date}>
              <circle
                className="dot"
                cx={xAccessorScaled(data)}
                cy={yAccessorScaled(data)}
                style={{
                  fill: colorAccessorScaled(data),
                  opacity: legend.show
                    ? isDayWithinRange(
                        data,
                        legend.minDateToHighlight,
                        legend.maxDateToHighlight,
                      )
                      ? 1
                      : 0.08
                    : 1,
                }}
                r={
                  legend.show
                    ? isDayWithinRange(
                        data,
                        legend.minDateToHighlight,
                        legend.maxDateToHighlight,
                      )
                      ? 5
                      : 2
                    : 4
                }
              />
              <path
                className="voronoi"
                d={voronoi.renderCell(idx)}
                onMouseEnter={() => showTooltip(data)}
                onMouseLeave={() => hideTooltip()}
              />
            </React.Fragment>
          ))}
          {tooltip.show ? (
            <circle
              className="tooltipDot"
              cx={tooltip.dot.cx}
              cy={tooltip.dot.cy}
              r={7}
            />
          ) : null}
          <g
            className="top-histogram"
            style={{
              transform: `translate(0, ${
                -dimensions.histogramHeight - dimensions.histogramMargin
              }px)`,
            }}
          >
            <path
              className="histogramArea"
              d={topHistogramLineGenerator(topHistogramBins)!}
            />
            <path
              d={legend.topHistogramPath}
              fill={legend.histogramFill}
              style={{ opacity: legend.show ? 1 : 0 }}
            />
          </g>
          <g
            className="rightHistogram"
            style={{
              transform: `translate(${
                dimensions.boundedWidth + dimensions.histogramMargin
              }px, -${dimensions.histogramHeight}px) rotate(90deg)`,
            }}
          >
            <path
              className="histogramArea"
              d={rightHistogramLineGenerator(rightHistogramBins)!}
            />
            <path
              d={legend.rightHistogramPath}
              fill={legend.histogramFill}
              style={{ opacity: legend.show ? 1 : 0 }}
            />
          </g>
          <g style={{ opacity: tooltip.show ? 1 : 0 }}>
            <rect
              className="hoverLine"
              x={tooltip.dot.cx}
              y={tooltip.dot.cy - hoverLineThickness / 2}
              width={
                dimensions.boundedWidth +
                dimensions.histogramMargin +
                dimensions.histogramHeight -
                tooltip.dot.cx
              }
              height={hoverLineThickness}
            />
            <rect
              className="hoverLine"
              x={tooltip.dot.cx - hoverLineThickness / 2}
              y={-dimensions.histogramMargin - dimensions.histogramHeight}
              width={hoverLineThickness}
              height={
                tooltip.dot.cy +
                dimensions.histogramMargin +
                dimensions.histogramHeight
              }
            />
          </g>
          {/* Step 6. Draw peripherals */}
          <Axis
            dimension="x"
            scale={xScale}
            numberOfTicks={4}
            label="Minimum Temperature (&deg;F)"
            lineClassName="domain"
            tickClassName="tick"
            labelClassName="axisLabel"
          />
          <Axis
            dimension="y"
            scale={yScale}
            numberOfTicks={4}
            label="Maximum Temperature (&deg;F)"
            lineClassName="domain"
            tickClassName="tick"
            labelClassName="axisLabel"
          />
          <g
            transform={`translate(${
              dimensions.boundedWidth - dimensions.legendWidth - 9
            }, ${dimensions.boundedHeight - 37})`}
            className="w-24"
          >
            <rect
              width={dimensions.legendWidth}
              height={dimensions.legendHeight}
              fill={`url(#${legendGradientId})`}
              onMouseMove={onLegendMouseMove}
              onMouseLeave={onLegendMouseLeave}
            />
            {legendTickValues.map((tickValue) => (
              <React.Fragment key={tickValue.toDateString()}>
                <text
                  className="legendValue"
                  x={legendTickScale(tickValue)}
                  y={-6}
                  style={{ opacity: legend.show ? 0 : 1 }}
                >
                  {d3.timeFormat("%b")(tickValue)}
                </text>
                <line
                  className="legendTick"
                  x1={legendTickScale(tickValue)}
                  x2={legendTickScale(tickValue)}
                  y1={6}
                  style={{ opacity: legend.show ? 0 : 1 }}
                />
              </React.Fragment>
            ))}
            <g
              style={{
                opacity: legend.show ? 1 : 0,
                transform: `translateX(${legend.barX}px)`,
              }}
              className="max-w-fit"
            >
              <rect
                className="legendHighlightBar"
                width={legendHighlightBarWidth}
                height={dimensions.legendHeight}
              />
              <text
                className="legendHighlightText"
                x={legendHighlightBarWidth / 2}
                y={-6}
              >
                {[
                  d3.timeFormat("%b %d")(legend?.minDateToHighlight),
                  d3.timeFormat("%b %d")(legend?.maxDateToHighlight),
                ].join(" - ")}
              </text>
            </g>
          </g>
        </ChartProvider>
        {/* Step 7b. Create interactions */}
        <div
          id="tooltip"
          className="tooltip"
          style={{
            opacity: tooltip.show ? 1 : 0,
            transform: `translate(calc(${tooltip.coords.x}px - 50%), calc(${tooltip.coords.y}px - 100%))`,
          }}
        >
          <div className="tooltipDate">
            <span id="date">{tooltip.formattedDate}</span>
          </div>
          <div className="tooltip-temperature">
            <span id="min-temperature">{tooltip.temperature?.min}</span>&deg;F -
            <span id="max-temperature">{tooltip.temperature?.max}</span>&deg;F
          </div>
        </div>
      </div>
    </div>
  );
}
