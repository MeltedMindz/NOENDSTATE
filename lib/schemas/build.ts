import { z } from "zod";

export const buildStatusSchema = z.enum([
  "research",
  "testing",
  "building",
  "paused",
  "shipped",
  "failed",
  "archived",
]);

export type BuildStatus = z.infer<typeof buildStatusSchema>;

export const buildEntrySchema = z.object({
  id: z.string().regex(/^BUILD-\d{3}$/),
  title: z.string().min(1),
  hypothesis: z.string().min(1),
  currentState: z.string().min(1),
  status: buildStatusSchema,
  owner: z.string().nullable(),
  startedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updatedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  projectId: z.string().nullable(),
  chronicleEventIds: z.array(z.string()),
  repositoryUrls: z.array(z.string()),
  outcome: z.string().nullable(),
  body: z.string().nullable(),
});

export type BuildEntry = z.infer<typeof buildEntrySchema>;
