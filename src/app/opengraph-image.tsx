import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Resuvee — Build better resumes & ATS optimization";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#16201c",
          padding: "60px 70px",
          fontFamily: "sans-serif",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(210, 252, 82, 0.15), transparent 40%), radial-gradient(circle at 15% 85%, rgba(227, 108, 67, 0.12), transparent 40%)",
        }}
      >
        {/* Top Header / Logo Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              backgroundColor: "#d2fc52",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#16201c",
              fontSize: "26px",
              fontWeight: "900",
            }}
          >
            R
          </div>
          <span
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: "-0.04em",
            }}
          >
            Resuvee
          </span>
        </div>

        {/* Hero Copy */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              padding: "8px 18px",
              borderRadius: "100px",
              color: "#d2fc52",
              fontSize: "16px",
              fontWeight: "700",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            16 Original Templates • ATS Analyzer • Cover Letters
          </div>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "800",
              color: "#ffffff",
              lineHeight: "1.05",
              letterSpacing: "-0.05em",
              margin: 0,
            }}
          >
            Your story, <span style={{ color: "#d2fc52" }}>clearly told.</span>
          </h1>
          <p
            style={{
              fontSize: "24px",
              color: "rgba(255, 255, 255, 0.7)",
              lineHeight: "1.4",
              margin: 0,
            }}
          >
            Build professional resumes, review ATS score compatibility, and export clean PDF & Word formats.
          </p>
        </div>

        {/* Feature Pills Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              backgroundColor: "#ffffff",
              color: "#16201c",
              padding: "10px 20px",
              borderRadius: "100px",
              fontSize: "15px",
              fontWeight: "800",
            }}
          >
            90%+ ATS Verified
          </div>
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "100px",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Clean PDF & Word Export
          </div>
          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              padding: "10px 20px",
              borderRadius: "100px",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            Privacy First
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
