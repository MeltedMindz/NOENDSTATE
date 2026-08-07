#!/usr/bin/env node
/**
 * Community synchronization planner.
 *
 * Reads the project registry and produces the plan for Discord categories,
 * Telegram topics, and social launch placeholders described in community/.
 *
 * DRY-RUN IS THE DEFAULT AND, TODAY, THE ONLY MODE. Applying changes
 * requires all of the following, none of which exist yet:
 *   --apply flag
 *   DISCORD_BOT_TOKEN env var (never committed)
 *   DISCORD_SERVER_ID env var matching community/discord/server-blueprint.yaml
 * When those exist, apply mode must print a diff and require confirmation.
 */
import { readFileSync } from "fs";

const apply = process.argv.includes("--apply");

if (apply) {
  if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_SERVER_ID) {
    console.error(
      "apply mode requires DISCORD_BOT_TOKEN and DISCORD_SERVER_ID.\n" +
        "No credentials are configured — refusing. Run without --apply for the plan."
    );
    process.exit(1);
  }
  console.error("apply mode is not implemented yet — dry-run is the only mode. Exiting.");
  process.exit(1);
}

const src = readFileSync("content/projects/index.ts", "utf8");
const ids = [...src.matchAll(/id:\s*"(P-\d{3})"[\s\S]*?name:\s*"([^"]+)"/g)];

console.log("── Community sync plan (dry run) ───────────────────────────────");
console.log("");
if (ids.length === 0) {
  console.log("Project registry is empty. Plan:");
  console.log("  Discord: no project categories to create.");
  console.log("  Telegram: no project topics to create.");
  console.log("  Social: no project launch placeholders needed.");
  console.log("");
  console.log("Base structure (community/discord/server-blueprint.yaml and");
  console.log("community/telegram/structure.yaml) is created manually at launch —");
  console.log("see the launch checklists in community/.");
} else {
  for (const [, id, name] of ids) {
    console.log(`${id} — ${name}`);
    console.log(`  Discord category: PROJECT ${id.slice(2)} — ${name.toUpperCase()}`);
    console.log("    channels: #overview #announcements #discussion #development #feedback #support");
    console.log(`  Telegram topic: ${name}`);
    console.log("  X: launch thread placeholder from community/x/project-launch-template.md");
    console.log("");
  }
}
console.log("No changes were made. Apply mode requires credentials and is gated.");
