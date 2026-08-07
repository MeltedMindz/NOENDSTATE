/**
 * Font loader for Open Graph image generation (satori requires TTF/OTF).
 * Fetching css2 without a browser user-agent makes Google Fonts return
 * truetype sources. Runs at build time only — the generated images are
 * static; no runtime network requests are introduced.
 */
async function loadGoogleFont(cssFamily: string): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${cssFamily}&display=swap`;
  const css = await (await fetch(cssUrl)).text();
  const match = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/);
  if (!match) {
    throw new Error(`No TTF source resolved for ${cssFamily}`);
  }
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Font download failed for ${cssFamily}`);
  return res.arrayBuffer();
}

export async function loadOgFonts() {
  const [newsreader, newsreaderItalic, plexMono] = await Promise.all([
    loadGoogleFont("Newsreader:wght@500"),
    loadGoogleFont("Newsreader:ital,wght@1,500"),
    loadGoogleFont("IBM+Plex+Mono:wght@500"),
  ]);
  return [
    { name: "Newsreader", data: newsreader, weight: 500 as const, style: "normal" as const },
    { name: "Newsreader", data: newsreaderItalic, weight: 500 as const, style: "italic" as const },
    { name: "IBM Plex Mono", data: plexMono, weight: 500 as const, style: "normal" as const },
  ];
}
