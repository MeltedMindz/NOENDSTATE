import { projects } from "@/content/projects";
import { chronicleEvents } from "@/content/chronicle/events";
import { builds } from "@/content/builds";
import { projectSchema, type Project } from "@/lib/schemas/project";
import {
  chronicleEventSchema,
  validateChronicle,
  type ChronicleEvent,
} from "@/lib/schemas/chronicle";
import { buildEntrySchema, type BuildEntry } from "@/lib/schemas/build";

/**
 * Content access layer. Everything the site renders passes through Zod
 * validation here; invalid content fails the build rather than shipping.
 */

export function getProjects(): Project[] {
  return projects
    .map((p) => projectSchema.parse(p))
    .filter((p) => p.public)
    .sort((a, b) => a.id.localeCompare(b.id));
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getChronicle(): ChronicleEvent[] {
  const events = chronicleEvents.map((e) => chronicleEventSchema.parse(e));
  const problems = validateChronicle(events);
  if (problems.length > 0) {
    throw new Error(`Chronicle integrity violation: ${problems.join("; ")}`);
  }
  return events
    .filter((e) => e.visibility === "public")
    .sort((a, b) => b.sequence - a.sequence);
}

export function getChronicleEvent(eventId: string): ChronicleEvent | undefined {
  return getChronicle().find((e) => e.eventId === eventId);
}

export function getBuilds(): BuildEntry[] {
  return builds
    .map((b) => buildEntrySchema.parse(b))
    .sort((a, b) => b.id.localeCompare(a.id));
}

export function getBuild(id: string): BuildEntry | undefined {
  return getBuilds().find((b) => b.id === id);
}

export function getEventsForProject(projectId: string): ChronicleEvent[] {
  return getChronicle().filter((e) => e.projectId === projectId);
}
