export interface TimelineData {
    date: string;
    temperature: number;
}

export interface ScatterPlotData {
    temperature: number;
    humidity: number;
}

export interface HistogramData {
    temperature: number;
    humidity: number;
}

export interface BoundedDimensions extends Dimensions {
    boundedWidth: number;
    boundedHeight: number;
}

export interface Dimensions {
    height?: number;
    width?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
}