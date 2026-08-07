import { NextResponse } from "next/server";
import { buildInfo } from "@/lib/build-info";
import { featureFlags } from "@/config/economics";
import { getChronicle } from "@/lib/content";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(
    {
      studio: "NO END STATE",
      website: "serving",
      build: buildInfo,
      chronicleRecords: getChronicle().length,
      features: {
        mint: featureFlags.stateZeroMintEnabled ? "enabled" : "disabled",
        claims: featureFlags.revenueClaimsEnabled ? "enabled" : "disabled",
        walletConnect: featureFlags.walletConnectEnabled ? "enabled" : "disabled",
        treasury: "not_initialized",
        communityLinks: "not_yet_public",
      },
      note: "Status reflects build time. External monitoring is a planned adapter, not a faked uptime figure.",
    },
    {
      headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
    }
  );
}
