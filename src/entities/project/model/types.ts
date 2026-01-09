import { Tables } from "@/type/supabase";

export interface ProjectSection {
  title: string;
  content: string;
}

export interface ProjectDetail {
  overview: string;
  period: string;
  team: string;
  role: string;
  techStack: string[];
  sections: ProjectSection[];
  links: {
    github: string | null;
    demo: string | null;
    notion: string | null;
  };
  images?: string[];
}

export interface Project extends Omit<Tables<'projects'>, 'detailInfo'> {
  detailInfo: ProjectDetail;
}