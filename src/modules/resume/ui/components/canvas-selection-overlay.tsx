"use client";

interface CanvasSelectionOverlayProps {
  highlightRect: {
    top: number;
    left: number;
    width: number;
    height: number;
  } | null;
}

export function CanvasSelectionOverlay({ highlightRect }: CanvasSelectionOverlayProps) {
  if (!highlightRect) return null;

  return (
    <div
      className="no-print pointer-events-none absolute z-30 hidden lg:block rounded-2xl border-2 border-[#059669] bg-emerald-500/10 transition-all duration-150 ease-out"
      style={{
        top: `${highlightRect.top}px`,
        left: `${highlightRect.left}px`,
        width: `${highlightRect.width}px`,
        height: `${highlightRect.height}px`,
      }}
    >
      <span className="absolute -bottom-3 right-2 rounded-full bg-[#059669] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white shadow-xs">
        SELECTED
      </span>
    </div>
  );
}
