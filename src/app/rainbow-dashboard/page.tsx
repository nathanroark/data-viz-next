'use client';
import './index.css';
import * as d3 from 'd3';
import { useState, useEffect, useRef } from 'react';
import Timeline from './components/Timeline';
import ScatterPlot from './components/ScatterPlot';
import Histogram from './components/Histogram';
import { getTimelineData, getScatterData } from './utils/dummyData';
import type {
  ScatterPlotData,
  TimelineData,
  HistogramData,
} from './utils/types';

const getData = () => ({
  timeline: getTimelineData(),
  scatter: getScatterData(),
  histogram: getScatterData(),
});

function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  });

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function Page() {
  const [data, setData] = useState(getData());

  const parseDate = d3.timeParse('%m/%d/%Y') as (date: string) => Date;
  const dateAccessor = (d: TimelineData) => parseDate(d.date);
  const temperatureAccessor = (
    d: ScatterPlotData | TimelineData | HistogramData,
  ) => d.temperature;
  const humidityAccessor = (d: ScatterPlotData | HistogramData) => d.humidity;

  useInterval(() => {
    setData(getData());
  }, 4000);

  return (
    <div className="App">
      <h1 className="rainbow-title">Rainbow Dashboard</h1>
      <div className="App__charts">
        <Timeline
          dataset={data.timeline}
          xAccessor={dateAccessor}
          yAccessor={temperatureAccessor}
          label="Temperature"
        />
        <ScatterPlot
          dataset={data.scatter}
          xAccessor={humidityAccessor}
          yAccessor={temperatureAccessor}
          xLabel="Humidity"
          yLabel="Temperature"
        />
        <Histogram
          dataset={data.histogram}
          xAccessor={humidityAccessor}
          label="Humidity"
        />
      </div>
    </div>
  );
}
