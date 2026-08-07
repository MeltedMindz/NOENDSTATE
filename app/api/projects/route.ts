import { NextResponse } from "next/server";
import { getProjects } from "@/lib/content";

export const dynamic = "force-static";

/** Public JSON registry — the same validated content the site renders. */
export function GET() {
  const projects = getProjects();
  return NextResponse.json(
    {
      studio: "NO END STATE",
      count: projects.length,
      note:
        projects.length === 0
          ? "The registry is honestly empty. The studio was founded 2026-08-07; projects appear here when they are real."
          : undefined,
      projects,
    },
    {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
    }
  );
}
