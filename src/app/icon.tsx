import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// ✨ 해결책: HSL 대신 Hex Code 사용 (파싱 에러 방지)
// HSL(173, 58%, 39%) -> #2A9D8F
const PRIMARY_MAIN = "#2A9D8F"; 
// HSL(173, 58%, 29%) -> #1F766C (약간 어두운 버전)
const PRIMARY_DARK = "#1F766C"; 

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          // ✨ Hex 코드를 사용하여 그라데이션 적용
          background: `linear-gradient(135deg, ${PRIMARY_MAIN} 0%, ${PRIMARY_DARK} 100%)`,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "8px",
          border: `1px solid ${PRIMARY_DARK}`,
          position: "relative",
        }}
      >
        {/* ✨ AI Spark Dot: 보라색 (Purple) */}
        <div
          style={{
            position: "absolute",
            top: "4px",
            right: "4px",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#a855f7", // Hex code
            boxShadow: "0 0 8px rgba(168, 85, 247, 0.8)",
          }}
        />
        {/* 텍스트 B */}
        <div style={{ fontWeight: 900, fontFamily: 'sans-serif', marginTop: 0 }}>
          B
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}