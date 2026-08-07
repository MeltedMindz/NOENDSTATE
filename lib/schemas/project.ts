import { z } from "zod";

export const projectStatusSchema = z.enum([
  "research",
  "prototype",
  "building",
  "live",
  "sunset",
  "archived",
]);

export type ProjectStatus = z.infer<typeof projectStatusSchema>;

export const projectSchema = z.object({
  id: z.string().regex(/^P-\d{3}$/, "Project IDs are P-000 style and stable forever"),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  oneLine: z.string().min(1),
  thesis: z.string().min(1),
  description: z.string().min(1),
  status: projectStatusSchema,
  category: z.string().min(1),
  startedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  launchedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  sunsetAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  chain: z.string().nullable(),
  repositoryUrl: z.string().url().nullable(),
  websiteUrl: z.string().url().nullable(),
  socialUrl: z.string().url().nullable(),
  contractAddresses: z.array(
    z.object({ label: z.string(), address: z.string(), chain: z.string() })
  ),
  audits: z.array(z.object({ auditor: z.string(), url: z.string().url(), date: z.string() })),
  revenuePolicy: z.string().nullable(),
  stateZeroAllocationBps: z.number().int().min(0).max(10000).nullable(),
  stateZeroAllocationApproved: z.boolean(),
  treasuryAddresses: z.array(z.string()),
  team: z.array(z.string()),
  technologies: z.array(z.string()),
  heroAsset: z.string().nullable(),
  gallery: z.array(z.string()),
  chronicleEventIds: z.array(z.string()),
  postmortemUrl: z.string().nullable(),
  public: z.boolean(),
  featured: z.boolean(),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type Project = z.infer<typeof projectSchema>;
