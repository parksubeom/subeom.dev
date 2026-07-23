export const PROFILE = {
  name: "박수범",
  role: "Frontend Developer",
  bio: "집에선 출력을, 회사에선 정확도를 연마합니다. 본인 페인 포인트에서 시작해 npm 과 Open VSX 에 진짜 출시하는 사이클을 좋아해요.",
  email: "sooknise@naver.com",
  phone: "010-8109-0731",
  location: "Seoul, Republic of Korea",

  links: {
    github: "https://github.com/parksubeom",
    threads: "https://www.threads.net/@water_bum_2",
    email: "mailto:sooknise@naver.com",
  },

  education: [
    { type: "university", name: "전남대학교" },
    { type: "bootcamp", name: "항해플러스 프론트엔드" },
  ],

  skills: [
    "React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS", "Pinia", "Supabase", "Framer Motion",
  ],
} as const;
