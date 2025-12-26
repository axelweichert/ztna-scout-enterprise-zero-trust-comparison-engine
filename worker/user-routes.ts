app.get('/api/config', (c) => {
  const env = c.env as any;
  // Public Turnstile site key must be provided as a public binding:
  // PUBLIC_TURNSTILE_SITE_KEY
  const siteKey = env.PUBLIC_TURNSTILE_SITE_KEY || "";
  return ok(c, { turnstileSiteKey: siteKey });
});