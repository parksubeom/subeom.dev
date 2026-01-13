/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
    formats: ['image/avif', 'image/webp'], // AVIF 및 WebP 형식 우선 사용
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // 이미지 캐시 TTL 설정
  },
  compiler: {
    // 프로덕션 빌드 최적화
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // 에러와 경고는 유지
    } : false,
  },
  // 압축 활성화
  compress: true,
  // 프로덕션 소스맵 비활성화 (보안 및 성능)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
