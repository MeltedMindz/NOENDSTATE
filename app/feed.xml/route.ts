import { getBuilds, getChronicle } from "@/lib/content";
import { studio } from "@/config/studio";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** RSS feed of Chronicle events and build entries. */
export function GET() {
  const events = getChronicle();
  const builds = getBuilds();

  const items = [
    ...events.map((e) => ({
      title: `${e.eventId} — ${e.title}`,
      link: `${studio.domain}/chronicle/${e.eventId}`,
      description: e.summary,
      date: e.recordedAt,
    })),
    ...builds.map((b) => ({
      title: `${b.id} — ${b.title}`,
      link: `${studio.domain}/build`,
      description: b.currentState,
      date: b.updatedAt,
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(`${studio.name} — Chronicle`)}</title>
    <link>${studio.domain}</link>
    <description>${escapeXml(studio.secondaryLine)}</description>
    <language>en</language>
    ${items
      .map(
        (i) => `<item>
      <title>${escapeXml(i.title)}</title>
      <link>${i.link}</link>
      <description>${escapeXml(i.description)}</description>
      <pubDate>${new Date(`${i.date}T12:00:00Z`).toUTCString()}</pubDate>
      <guid>${i.link}</guid>
    </item>`
      )
      .join("\n    ")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
    },
  });
}
