import { z } from "zod";

const nodeDetailsSchema = z.record(
  z.union([z.string(), z.number(), z.object({})]),
);

const nodeSchema = z.object({
  name: z.string().optional(),
  group: z.string().optional(),
  timestamp: z.string().optional(),
  details: nodeDetailsSchema.optional(),
  size: z.number().optional(),
  environment: z.string().optional(),
  notes: z.string().optional(),
});

const linkDetailsSchema = z.record(z.union([z.string(), z.number()]));

const linkSchema = z.object({
  source: z.string(),
  target: z.string(),
  sourceChild: z.string().optional(),
  targetChild: z.string().optional(),
  details: linkDetailsSchema.optional(),
});

export const ServicesGraphSchema = z.object({
  nodes: z.array(nodeSchema),
  links: z.array(linkSchema),
});
export type ServicesGraphData = z.infer<typeof ServicesGraphSchema>;
