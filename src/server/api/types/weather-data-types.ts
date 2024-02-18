import * as z from "zod";

export const WeatherDataSchema = z.object({
  time: z.number(),
  summary: z.string(),
  icon: z.string(),
  sunriseTime: z.number(),
  sunsetTime: z.number(),
  moonPhase: z.number(),
  precipIntensity: z.number(),
  precipIntensityMax: z.number(),
  precipProbability: z.number(),
  precipType: z.string().optional(),
  temperatureHigh: z.number(),
  temperatureHighTime: z.number(),
  temperatureLow: z.number().optional(),
  temperatureLowTime: z.number().optional(),
  apparentTemperatureHigh: z.number(),
  apparentTemperatureHighTime: z.number(),
  apparentTemperatureLow: z.number().optional(),
  apparentTemperatureLowTime: z.number().optional(),
  dewPoint: z.number(),
  humidity: z.number(),
  pressure: z.number(),
  windSpeed: z.number(),
  windGust: z.number(),
  windGustTime: z.number(),
  windBearing: z.number(),
  cloudCover: z.number(),
  uvIndex: z.number(),
  uvIndexTime: z.number(),
  visibility: z.number(),
  temperatureMin: z.number(),
  temperatureMinTime: z.number(),
  temperatureMax: z.number(),
  temperatureMaxTime: z.number(),
  apparentTemperatureMin: z.number(),
  apparentTemperatureMinTime: z.number(),
  apparentTemperatureMax: z.number(),
  apparentTemperatureMaxTime: z.number(),
  date: z.string(),
});

export const WeatherDataArraySchema = z.array(WeatherDataSchema);

export type WeatherData = z.infer<typeof WeatherDataSchema>;

export type precipTypeOption = "rain" | "sleet" | "snow";

// export interface WeatherData {
//     time: number;
//     summary: string;
//     icon: string;
//     sunriseTime: number;
//     sunsetTime: number;
//     moonPhase: number;
//     precipIntensity: number;
//     precipIntensityMax: number;
//     precipProbability: number;
//     //? precipType only exists if precipProbability is higher than 0
//     precipType?: precipTypeOption;
//     temperatureHigh: number;
//     temperatureHighTime: number;
//     temperatureLow: number;
//     temperatureLowTime: number;
//     apparentTemperatureHigh: number;
//     apparentTemperatureHighTime: number;
//     apparentTemperatureLow: number;
//     apparentTemperatureLowTime: number;
//     dewPoint: number;
//     humidity: number;
//     pressure: number;
//     windSpeed: number;
//     windGust: number;
//     windGustTime: number;
//     windBearing: number;
//     cloudCover: number;
//     uvIndex: number;
//     uvIndexTime: number;
//     visibility: number;
//     temperatureMin: number;
//     temperatureMinTime: number;
//     temperatureMax: number;
//     temperatureMaxTime: number;
//     apparentTemperatureMin: number;
//     apparentTemperatureMinTime: number;
//     apparentTemperatureMax: number;
//     apparentTemperatureMaxTime: number;
//     date: string;
//   }
