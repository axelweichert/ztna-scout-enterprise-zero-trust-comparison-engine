/* Minimal bootstrap for CI. Safe no-op if not needed. */
try {
  // Intentionally empty.
  // Keep this file to avoid ESM/require issues with .bootstrap.js under "type":"module".
  process.exit(0);
} catch (e) {
  process.exit(0);
}
