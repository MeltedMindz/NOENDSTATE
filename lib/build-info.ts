/**
 * Build-time facts. Captured when the site is compiled — honest "as of this
 * deployment" data, clearly presented as such. No fake uptime, no invented
 * monitoring.
 */
export const buildInfo = {
  builtAt: new Date().toISOString(),
  commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
  branch: process.env.VERCEL_GIT_COMMIT_REF ?? null,
  environment: process.env.VERCEL_ENV ?? "local",
} as const;
