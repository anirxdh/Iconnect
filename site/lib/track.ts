/**
 * Anonymous event tracking, safe everywhere: events reach Vercel Web
 * Analytics only when its script is mounted (production deployments).
 * Local dev and the test suite stay completely network-silent.
 * No identifiers, no profiles — event names and coarse labels only.
 */
type Props = Record<string, string | number | boolean>;

type VaQueue = (...args: unknown[]) => void;

export function trackEvent(name: string, props?: Props) {
  if (typeof window === "undefined") return;
  const va = (window as { va?: VaQueue }).va;
  if (!va) return;
  va("event", { name, data: props });
}
