import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NO END STATE",
    short_name: "NO END STATE",
    description:
      "An internet-native, onchain product and protocol studio. Founded once. Building indefinitely.",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0d0b",
    theme_color: "#0e0d0b",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
