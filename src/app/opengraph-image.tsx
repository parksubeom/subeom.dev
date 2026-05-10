import { ImageResponse } from "next/og";
import { PROFILE } from "@/shared/config/profile";

export const runtime = "edge";
export const alt = "Subeom.dev - Frontend & Web Accessibility";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const COLORS = {
  background: "#0f172a",
  backgroundEnd: "#1e293b",
  primary: "#2A9D8F",
  purple: "#a855f7",
  text: "#f8fafc",
  muted: "#94a3b8",
};

// GitHub 아바타 URL — username만 갈아끼우면 사진 자동 동기화
const githubUsername = PROFILE.links.github.split("/").pop() || "parksubeom";
const PROFILE_IMAGE_URL = `https://github.com/${githubUsername}.png?size=320`;

export default async function Image() {
  // GitHub 아바타를 fetch — 실패 시 fallback 로고로 대체
  let profileImageData: string | null = null;
  try {
    const res = await fetch(PROFILE_IMAGE_URL);
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      profileImageData = `data:image/png;base64,${base64}`;
    }
  } catch {
    profileImageData = null;
  }

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
          {/* 1. 프로필 사진 (GitHub 아바타) — 실패 시 B 로고 fallback */}
          {profileImageData ? (
            <div
              style={{
                display: "flex",
                width: "200px",
                height: "200px",
                borderRadius: "100px",
                overflow: "hidden",
                border: `4px solid ${COLORS.primary}`,
                boxShadow: `0 20px 50px rgba(0,0,0,0.4), 0 0 30px ${COLORS.primary}40`,
                position: "relative",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profileImageData}
                alt={PROFILE.name}
                width={200}
                height={200}
                style={{ objectFit: "cover" }}
              />
            </div>
          ) : (
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
          )}

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
              <span>Web Accessibility</span>
            </div>

            {/* 이름 표기 추가 — 브랜딩 강화 */}
            <div
              style={{
                fontSize: "24px",
                fontWeight: 500,
                color: COLORS.muted,
                marginTop: "16px",
              }}
            >
              {PROFILE.name} · Frontend Developer
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
