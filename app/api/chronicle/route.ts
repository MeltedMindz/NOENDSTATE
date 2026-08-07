import { NextResponse } from "next/server";
import { getChronicle } from "@/lib/content";

export const dynamic = "force-static";

/** Public JSON Chronicle — append-only, newest first. */
export function GET() {
  const events = getChronicle();
  return NextResponse.json(
    {
      studio: "NO END STATE",
      integrity: "append-only; corrections supersede, never replace",
      count: events.length,
      events,
    },
    {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" },
    }
  );
}
