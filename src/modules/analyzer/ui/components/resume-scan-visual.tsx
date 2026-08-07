"use client";

interface ResumeScanVisualProps {
  status: "idle" | "dragging" | "ready";
}

export function ResumeScanVisual({ status }: ResumeScanVisualProps) {
  const isReady = status === "ready";

  return (
    <div
      className={[
        "analyzer-upload-visual relative flex h-[88px] w-[106px] items-center justify-center",
        status === "dragging"
          ? "analyzer-upload-visual--dragging text-[#315b46]"
          : "text-(--brand-ink)",
      ].join(" ")}
      aria-hidden="true"
    >
      <span className="absolute inset-x-3 bottom-0 h-4 rounded-full bg-[#6f8978]/15 blur-md" />
      <svg viewBox="0 0 106 88" className="relative h-full w-full overflow-visible" fill="none">
        <path
          d="M32 8.5h31.5L78 23v49.5a7 7 0 0 1-7 7H32a7 7 0 0 1-7-7v-57a7 7 0 0 1 7-7Z"
          fill="#fff"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M63.5 9v10a4 4 0 0 0 4 4h10"
          fill="#edf3ed"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M36 34h30M36 43h24M36 52h27"
          stroke="#91a097"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {!isReady && (
          <>
            <path
              d="M17 28v-7a5 5 0 0 1 5-5h7M89 28v-7a5 5 0 0 0-5-5h-7M17 60v7a5 5 0 0 0 5 5h7M89 60v7a5 5 0 0 1-5 5h-7"
              stroke="#789584"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <g className="analyzer-scan-beam">
              <path d="M19 31h68" stroke="#4f8067" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M24 34h58"
                stroke="#82c7a5"
                strokeWidth="5"
                strokeLinecap="round"
                opacity=".16"
              />
            </g>
          </>
        )}

        {isReady && (
          <g className="analyzer-ready-check">
            <circle cx="78" cy="65" r="13" fill="#315b46" stroke="#fff" strokeWidth="3" />
            <path
              d="m72.5 65 3.5 3.5 7-7.5"
              stroke="#fff"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}
      </svg>
    </div>
  );
}
