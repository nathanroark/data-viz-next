import * as d3 from "d3";

const randomAroundMean = (mean: number, deviation: number): number => mean + boxMullerRandom() * deviation;
const boxMullerRandom = (): number => (
    Math.sqrt(-2.0 * Math.log(Math.random())) *
    Math.cos(2.0 * Math.PI * Math.random())
);

const today = new Date();
const formatDate = d3.timeFormat("%m/%d/%Y");

interface TimelineData {
    date: string;
    temperature: number;
}

export const getTimelineData = (length = 100): TimelineData[] => {
    let lastTemperature = randomAroundMean(70, 20);
    const firstTemperature = d3.timeDay.offset(today, -length);

    return new Array(length).fill(0).map((_, i) => {
        lastTemperature += randomAroundMean(0, 2);
        return {
            date: formatDate(d3.timeDay.offset(firstTemperature, i)),
            temperature: lastTemperature,
        };
    });
};

interface ScatterData {
    temperature: number;
    humidity: number;
}

export const getScatterData = (count = 100): ScatterData[] => (
    new Array(count).fill(0).map(() => ({
        temperature: randomAroundMean(70, 20),
        humidity: randomAroundMean(0.5, 0.1),
    }))
)