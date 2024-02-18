import { api } from "@/trpc/server";
import "./index.css";
import Chart from "./Chart";

export default async function MarginalHistogram() {
  const dataset = await api.post.getWeatherData.query();

  return (
    <div className="flex justify-center">
      <div className="flex w-full max-w-4xl flex-wrap items-center justify-center">
        <Chart dataset={dataset} />
      </div>
    </div>
  );
}
