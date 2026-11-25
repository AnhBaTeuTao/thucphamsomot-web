export const MIN_TRANSITION_MS = 1000;
export const MAX_TRANSITION_WAIT_MS = 12000;

export type TransitionPhase = "idle" | "entering" | "waiting" | "leaving";

export type CategoryTransitionSnapshot = {
  phase: TransitionPhase;
  transitionId: number;
  slug: string | null;
  targetUrl: string | null;
  targetPath: string | null;
};

type Listener = () => void;

type ReadyWaiter = {
  transitionId: number;
  targetPath: string;
  targetUrl: string;
  initialUrl: string;
  resolve: (outcome: "ready" | "timeout" | "cancelled") => void;
  timerId: number;
};

const IDLE_SNAPSHOT: CategoryTransitionSnapshot = {
  phase: "idle",
  transitionId: 0,
  slug: null,
  targetUrl: null,
  targetPath: null,
};

let snapshot: CategoryTransitionSnapshot = IDLE_SNAPSHOT;
let idCounter = 0;

const listeners = new Set<Listener>();
const readyWaiters = new Map<number, ReadyWaiter>();

function emit() {
  listeners.forEach((fn) => fn());
}

export function normalizeTransitionPath(url: string): string {
  const clean = (url || "/").split("#")[0].split("?")[0].replace(/\/+$/, "");
  return clean || "/";
}

export function normalizeTransitionUrl(url: string): string {
  const withoutHash = (url || "/").split("#")[0] || "/";
  const [p, q] = withoutHash.split("?");
  const cleanPath = (p || "/").replace(/\/+$/, "") || "/";
  return q ? `${cleanPath}?${q}` : cleanPath;
}

export function subscribeCategoryTransition(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getCategoryTransitionSnapshot(): CategoryTransitionSnapshot {
  return snapshot;
}

export function nextTransitionId(): number {
  idCounter += 1;
  return idCounter;
}

export function startTransitionState(params: {
  transitionId: number;
  slug: string;
  targetUrl: string;
}) {
  snapshot = {
    phase: "entering",
    transitionId: params.transitionId,
    slug: params.slug,
    targetUrl: normalizeTransitionUrl(params.targetUrl),
    targetPath: normalizeTransitionPath(params.targetUrl),
  };
  emit();
}

export function advanceTransitionPhase(transitionId: number, phase: Exclude<TransitionPhase, "idle">) {
  if (snapshot.transitionId !== transitionId) return;
  if (snapshot.phase === phase) return;
  snapshot = { ...snapshot, phase };
  emit();
}

export function finishTransitionState(transitionId?: number) {
  if (transitionId !== undefined && snapshot.transitionId !== transitionId) return;
  // Cancel any stale waiter for this transitionId
  if (transitionId !== undefined) {
    const w = readyWaiters.get(transitionId);
    if (w) {
      window.clearTimeout(w.timerId);
      readyWaiters.delete(transitionId);
      w.resolve("cancelled");
    }
  }
  if (snapshot.phase === "idle" && snapshot.transitionId === 0) return;
  snapshot = IDLE_SNAPSHOT;
  emit();
}

/**
 * Idempotent signal called by <TransitionReady /> whenever destination pathname/search paints & decodes.
 * Bound strictly to active waiters' transitionId so stale signals never leak across runs.
 */
export function markTransitionReady(currentUrl: string) {
  const normUrl = normalizeTransitionUrl(currentUrl);
  const normPath = normalizeTransitionPath(currentUrl);

  for (const [tid, waiter] of Array.from(readyWaiters.entries())) {
    const matchesTarget =
      normUrl === waiter.targetUrl ||
      normPath === waiter.targetPath ||
      (waiter.targetPath !== normalizeTransitionPath(waiter.initialUrl) &&
        normPath !== normalizeTransitionPath(waiter.initialUrl));

    if (matchesTarget) {
      window.clearTimeout(waiter.timerId);
      readyWaiters.delete(tid);
      waiter.resolve("ready");
    }
  }
}

export function cancelReadyWaiter(transitionId: number) {
  const waiter = readyWaiters.get(transitionId);
  if (!waiter) return;
  window.clearTimeout(waiter.timerId);
  readyWaiters.delete(transitionId);
  waiter.resolve("cancelled");
}

/**
 * Creates a fresh per-transition Promise bound to `transitionId`.
 */
export function createTransitionReadyWaiter(
  transitionId: number,
  targetUrl: string,
  initialUrl: string,
  timeoutMs = MAX_TRANSITION_WAIT_MS
): Promise<"ready" | "timeout" | "cancelled"> {
  const normTargetUrl = normalizeTransitionUrl(targetUrl);
  const normTargetPath = normalizeTransitionPath(targetUrl);
  const normInitialUrl = normalizeTransitionUrl(initialUrl);

  // Cancel any old waiter under same id (defensive)
  cancelReadyWaiter(transitionId);

  return new Promise<"ready" | "timeout" | "cancelled">((resolve) => {
    const timerId = window.setTimeout(() => {
      if (readyWaiters.delete(transitionId)) {
        resolve("timeout");
      }
    }, timeoutMs);

    readyWaiters.set(transitionId, {
      transitionId,
      targetPath: normTargetPath,
      targetUrl: normTargetUrl,
      initialUrl: normInitialUrl,
      resolve,
      timerId,
    });
  });
}
