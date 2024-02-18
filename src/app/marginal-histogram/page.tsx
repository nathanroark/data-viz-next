import { api } from "@/trpc/server";
import "./index.css";
import Chart from "./Chart";

export default async function MarginalHistogram() {
  const dataset = await api.post.getWeatherData.query();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center">
        <Chart dataset={dataset} />
      </div>
    </div>
  );
}
