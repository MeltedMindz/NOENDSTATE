import type { Project } from "@/lib/schemas/project";

/**
 * The project registry.
 *
 * Empty by design: NO END STATE has not launched a project yet, and the
 * registry does not invent a portfolio. Prior work by the founder is not
 * placed under NO END STATE unless it is formally adopted with approved
 * content — see docs/studio/project-lifecycle.md.
 *
 * Add projects with `pnpm studio:new-project`, which allocates the next
 * stable P-NNN id and scaffolds the record for review.
 */
export const projects: Project[] = [];
