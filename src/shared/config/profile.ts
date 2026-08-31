export const PROFILE = {
  name: "박수범",
  role: "Frontend Developer",
  bio: "팀에 잘 녹아들고, 일하는 방식을 함께 바꿔 갑니다. 혼자 잘 쓰던 방식을 공용 레포·스킬로 팀에 전파하고, 반복되는 판단은 AI 로 굳혀 다시 헤매지 않게 해요.",
  email: "bumpi5778@gmail.com",
  phone: "010-8109-0731",
  location: "Seoul, Republic of Korea",

  links: {
    github: "https://github.com/parksubeom",
    threads: "https://www.threads.net/@water_bum_2",
    email: "mailto:bumpi5778@gmail.com",
  },

  education: [
    { type: "university", name: "전남대학교" },
    { type: "bootcamp", name: "항해플러스 프론트엔드" },
  ],

  skills: [
    "React", "Next.js", "Vue.js", "TypeScript", "Tailwind CSS", "Pinia", "Supabase", "Framer Motion",
  ],
} as const;
