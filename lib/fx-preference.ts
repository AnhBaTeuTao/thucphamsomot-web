"use client";

export const TPS1_FX_STORAGE_KEY = "tps1-fx-disabled";
export const TPS1_FX_CHANGE_EVENT = "tps1-fx-change";

export function isTps1FxDisabled(): boolean {
  if (typeof window === "undefined") return false;
  if (document.documentElement.classList.contains("tps1-fx-disabled")) {
    return true;
  }
  try {
    return window.localStorage.getItem(TPS1_FX_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function applyTps1FxDomState(disabled: boolean): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (disabled) {
    root.classList.add("tps1-fx-disabled");
    root.setAttribute("data-tps1-fx", "off");
  } else {
    root.classList.remove("tps1-fx-disabled");
    root.setAttribute("data-tps1-fx", "on");
  }
}

export function setTps1FxDisabled(disabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (disabled) {
      window.localStorage.setItem(TPS1_FX_STORAGE_KEY, "1");
    } else {
      window.localStorage.removeItem(TPS1_FX_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota / private mode errors
  }

  applyTps1FxDomState(disabled);

  window.dispatchEvent(
    new CustomEvent<{ disabled: boolean }>(TPS1_FX_CHANGE_EVENT, {
      detail: { disabled },
    })
  );
}
