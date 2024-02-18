import { z } from "zod";
import type { WeatherData } from "@/server/api/types/weather-data-types";
import type { ServicesGraphData } from "@/server/api/types/services-graph-types";
import { WeatherDataArraySchema } from "@/server/api/types/weather-data-types";
import { ServicesGraphSchema } from "@/server/api/types/services-graph-types";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import path from "path";

import { promises as fs } from "fs";

let post = {
  id: 1,
  name: "Hello World",
};

const dataDirectory = path.join(process.cwd(), "src/server/data");

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      post = { id: post.id + 1, name: input.name };
      return post;
    }),

  getLatest: publicProcedure.query(() => {
    return post;
  }),

  getWeatherData: publicProcedure.query(async () => {
    const fileContents = await fs.readFile(
      dataDirectory + "/my_weather_data.json",
      "utf8",
    );
    const parsedData = JSON.parse(fileContents) as WeatherData[]; // Explicitly type the result of JSON.parse
    const message: WeatherData[] = WeatherDataArraySchema.parse(parsedData); // Now parse knows the type
    return message;
  }),
  getServicesGraphData: publicProcedure.query(async () => {
    const fileContents = await fs.readFile(
      path.join(dataDirectory, "/my_services_graph.json"),
      "utf8",
    );
    const parsedData = JSON.parse(fileContents) as ServicesGraphData;
    const validatedData = ServicesGraphSchema.parse(parsedData);
    return validatedData;
  }),
});
