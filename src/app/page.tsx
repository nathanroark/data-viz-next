import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
// import { CreatePost } from "@/app/_components/create-post";
// import { api } from "@/trpc/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { demos } from "@/lib/demos";

export default async function Home() {
  noStore();
  // const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex flex-col items-center justify-center pb-24 text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Data <span className="text-[hsl(130,100%,70%)]">Viz</span> Demos
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {demos.map((demo) => (
            <Link key={"main" + demo.name} href={demo.href}>
              <Card className="max-w-xs hover:bg-white/5">
                <CardHeader className="text-2xl font-bold">
                  {demo.name} →
                </CardHeader>
                <CardContent className="text-lg">
                  {demo.description}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {/* <div className="flex flex-col items-center gap-2"> */}
        {/*   <p className="text-2xl text-white"> */}
        {/*     {hello ? hello.greeting : "Loading tRPC query..."} */}
        {/*   </p> */}
        {/* </div> */}
        {/* <CrudShowcase /> */}
      </div>
    </main>
  );
}

// async function CrudShowcase() {
//   const latestPost = await api.post.getLatest.query();
//
//   return (
//     <div className="w-full max-w-xs">
//       {latestPost ? (
//         <p className="truncate">Your most recent post: {latestPost.name}</p>
//       ) : (
//         <p>You have no posts yet.</p>
//       )}
//
//       <CreatePost />
//     </div>
//   );
// }
