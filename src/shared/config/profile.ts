export const PROFILE = {
  name: "박수범",
  role: "Frontend Developer",
  bio: "비즈니스 임팩트를 고민하며 근본적인 문제 해결에 집중합니다.",
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
    "React", "Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion",
  ],
} as const;
