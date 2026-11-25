import type { ReactNode } from "react";
import { TransitionReady } from "@/components/b2b/transition-ready";

export default function CategoryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <TransitionReady />
    </>
  );
}
