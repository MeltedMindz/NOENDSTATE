import Link from "next/link";
import type { ChronicleEvent } from "@/lib/schemas/chronicle";
import { VerificationBadge } from "@/components/ui";
import styles from "./ChronicleList.module.css";

const TYPE_COLOR: Record<string, string> = {
  studio_founded: "var(--signal-cyan)",
  state_zero_created: "var(--signal-cyan)",
  project_launched: "var(--signal-green)",
  release: "var(--signal-yellow)",
  milestone: "var(--signal-yellow)",
  incident: "var(--signal-ember)",
  project_sunset: "var(--signal-coral)",
  postmortem: "var(--signal-coral)",
};

export function ChronicleList({
  events,
  compact = false,
}: {
  events: ChronicleEvent[];
  compact?: boolean;
}) {
  if (events.length === 0) {
    return (
      <p className="prose">
        No public events match this filter. The record only grows — check back.
      </p>
    );
  }
  return (
    <ol className={styles.list} aria-label="Chronicle events, newest first">
      {events.map((event) => (
        <li key={event.eventId} className={styles.item}>
          <Link href={`/chronicle/${event.eventId}`} className={styles.row}>
            <span
              className={styles.tick}
              style={{ background: TYPE_COLOR[event.type] ?? "var(--ash)" }}
              aria-hidden="true"
            />
            <span className={styles.meta}>
              <span className={styles.id}>{event.eventId}</span>
              <span className={styles.type}>{event.type.replace(/_/g, " ")}</span>
            </span>
            <span className={styles.body}>
              <span className={styles.title}>{event.title}</span>
              {!compact && <span className={styles.summary}>{event.summary}</span>}
            </span>
            <span className={styles.side}>
              <time dateTime={event.occurredAt} className={styles.date}>
                {event.occurredAt}
              </time>
              <VerificationBadge status={event.verificationStatus} />
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
