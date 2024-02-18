import * as React from "react";
import * as d3 from "d3";
import type { HistogramData } from "../../utils/types";

interface BarProps extends React.SVGAttributes<SVGPathElement> {
    bins: d3.Bin<HistogramData, number>[],
    keyAccessor: (_: d3.Bin<HistogramData, number>, i: number) => number,
    callAccessor: (bin: ((bin: d3.Bin<HistogramData, number>) => number), d: d3.Bin<HistogramData, number>) => number,
    xAccessor: (bin: d3.Bin<HistogramData, number>) => number,
    yAccessor: (bin: d3.Bin<HistogramData, number>) => number,
    widthAccessor: (bin: d3.Bin<HistogramData, number>) => number,
    heightAccessor: (bin: d3.Bin<HistogramData, number>) => number,
}

function Bars({
    bins,
    keyAccessor,
    callAccessor,
    xAccessor,
    yAccessor,
    widthAccessor,
    heightAccessor,
    ...props
}: BarProps) {



    return (<React.Fragment>
        {bins.map((d, i) => (
            <rect {...props}
                style={{ fill: `url(#Histogram-gradient)` }}
                className="Bars__rect" key={keyAccessor(d, i)}
                x={callAccessor(xAccessor, d)}
                y={callAccessor(yAccessor, d)}
                width={d3.max([callAccessor(widthAccessor, d), 0])}
                height={d3.max([callAccessor(heightAccessor, d), 0])}
            />
        ))}
    </React.Fragment>);
}

export default Bars;