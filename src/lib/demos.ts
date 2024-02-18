export type Demo = {
  name: string;
  href: string;
  description?: string;
};

export const demos: Demo[] = [
  {
    name: "Basic Dashboard",
    href: "basic-dashboard",
    description: "Simple, animated, randomized charts in D3",
  },
  {
    name: "Rainbow Dashboard",
    href: "rainbow-dashboard",
    description: "Simple, animated, randomized rainbow charts in D3",
  },
  {
    name: "Marginal Histogram",
    href: "marginal-histogram",
    description: "Highly interactive histogram demo in D3",
  },
  // not ready yet, might never be
  // {
  //   name: "Interactive Force Graph",
  //   href: "interactive-force-graph",
  //   description: "A interactive force-directed graph in D3",
  // },
];
