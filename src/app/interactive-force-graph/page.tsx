import { api } from "@/trpc/server";
import Chart from "./chart";

export default async function MarginalHistogram() {
  const dataset = await api.post.getServicesGraphData.query();

  return (
    <div>
      <Chart dataset={dataset} />
    </div>
  );
}
