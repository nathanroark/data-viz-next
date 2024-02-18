// import { api } from "@/trpc/server";
import { ForceGraph } from "./graph";
import { data } from "./miserables";

export default async function MarginalHistogram() {
  // const dataset = await api.post.getWeatherData.query();
  // const mutedPastel = [
  //   "#4c566a",
  //   "#d8dee9",
  //   "#bf616a",
  //   "#a3be8c",
  //   "#ebcb8b",
  //   "#81a1c1",
  //   "#b48ead",
  // ];
  return (
    <div>
      <div className="flex flex-wrap items-center justify-center">
        {/* <Chart dataset={dataset} /> */}
        <ForceGraph nodes={data.nodes} links={data.links} />
      </div>
    </div>
  );
}
