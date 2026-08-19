/**
 * Detects whether the application is running in local/development mode
 * (e.g. Localhost, Vite dev server, AI Studio development container)
 * or in public/shared preview mode (e.g. ais-pre-*, production deployments).
 */
export function isLocalAppEnvironment(): boolean {
  if (typeof window === 'undefined') return true;

  const hostname = window.location.hostname || '';

  // Localhost or 127.0.0.1
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
    return true;
  }

  // AI Studio Development container ingress (ais-dev-*)
  if (hostname.includes('ais-dev-')) {
    return true;
  }

  // Vite development environment flag
  if (import.meta.env.DEV) {
    return true;
  }

  // Optional manual parameter override for testing (?local=true or ?dev=true)
  if (window.location.search.includes('local=true') || window.location.search.includes('dev=true')) {
    return true;
  }

  return false;
}
