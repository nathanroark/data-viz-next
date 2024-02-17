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
  {
    name: "Force Graph",
    href: "force-graph",
    description: "A force-directed graph in D3",
  },
];
