import { SectionHandoff } from "@/components/ui/SectionHandoff";

const chapters = [
  { id: "projects", label: "開発実績" },
  { id: "team", label: "開発体制" },
  { id: "process", label: "進め方" },
  { id: "contacts", label: "担当者・連絡先" },
] as const;

export function ChapterNav() {
  return <SectionHandoff chapters={chapters} rootSelector="#intro-top" headerOffset={76} mobileHeaderOffset={68} />;
}
