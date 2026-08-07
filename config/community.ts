/**
 * Community surface configuration.
 * A null url means the surface is not yet public. The UI must render an
 * honest "not yet public" state — never a dead link, never a fake button.
 */
export type CommunitySurface = {
  name: string;
  role: string;
  url: string | null;
  status: "live" | "not_yet_public" | "opening_soon";
};

export const community: Record<string, CommunitySurface> = {
  x: {
    name: "X",
    role: "The public building record.",
    url: null,
    status: "not_yet_public",
  },
  discord: {
    name: "Discord",
    role: "The organized studio headquarters.",
    url: null,
    status: "not_yet_public",
  },
  telegram: {
    name: "Telegram",
    role: "The fast-moving public conversation.",
    url: null,
    status: "not_yet_public",
  },
  github: {
    name: "GitHub",
    role: "The code and technical record.",
    url: "https://github.com/MeltedMindz/NOENDSTATE",
    status: "live",
  },
};

export const liveSurfaces = Object.values(community).filter((s) => s.url && s.status === "live");
