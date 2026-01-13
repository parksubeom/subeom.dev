import { ImageResponse } from "next/og";

// 설정
export const runtime = "edge";
export const alt = "Subeom.dev - Frontend & Web Accessibility";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// 브랜드 컬러 (Hex Code 필수)
const COLORS = {
  background: "#0f172a", // Slate-900
  backgroundEnd: "#1e293b", // Slate-800
  primary: "#2A9D8F", // Teal (브랜드 컬러)
  purple: "#a855f7", // Purple (포인트 컬러)
  text: "#f8fafc", // Slate-50
  muted: "#94a3b8", // Slate-400
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.background,
          backgroundImage: `radial-gradient(circle at 25px 25px, ${COLORS.backgroundEnd} 2%, transparent 0%), linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.backgroundEnd} 100%)`,
          backgroundSize: "100px 100px, 100% 100%",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* 배경 효과: 우측 상단 Primary Glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            background: COLORS.primary,
            opacity: 0.15,
            filter: "blur(120px)",
            borderRadius: "50%",
          }}
        />
        {/* 배경 효과: 좌측 하단 Purple Glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            left: "-150px",
            width: "500px",
            height: "500px",
            background: COLORS.purple,
            opacity: 0.1,
            filter: "blur(120px)",
            borderRadius: "50%",
          }}
        />

        {/* === 중앙 컨텐츠 === */}
        <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
          
          {/* 1. 로고 심볼 (B) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "160px",
              height: "160px",
              borderRadius: "32px",
              background: COLORS.primary,
              border: `2px solid rgba(255,255,255,0.1)`,
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            <div
              style={{
                fontSize: "100px",
                fontWeight: 900,
                color: "white",
                marginTop: "-8px",
              }}
            >
              B
            </div>
            {/* 포인트 Dot */}
            <div
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: COLORS.purple,
                boxShadow: `0 0 20px ${COLORS.purple}`,
              }}
            />
          </div>

          {/* 2. 텍스트 정보 */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: "72px",
                fontWeight: 800,
                color: COLORS.text,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                marginBottom: "20px",
              }}
            >
              subeom.dev
            </div>
            
            {/* ✨ 문구 변경 부분 */}
            <div
              style={{
                fontSize: "32px",
                fontWeight: 600,
                color: COLORS.primary,
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span>Frontend Engineering</span>
              <span style={{ color: COLORS.muted }}>•</span>
              {/* 접근성을 강조하는 문구 */}
              <span>Web Accessibility</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}