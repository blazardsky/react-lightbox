import type { ReactNode } from "react";

function Grid({ children, min = "12rem" }: { children: ReactNode; min?: string }) {
  return (
    <div className="olo-grid" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${min}, 1fr))` }}>
      {children}
    </div>
  );
}

function Strip({ children }: { children: ReactNode }) {
  return <div className="olo-strip">{children}</div>;
}

function Featured({ children }: { children: ReactNode }) {
  return <div className="olo-featured">{children}</div>;
}

export const Gallery = { Grid, Strip, Featured };
