import { StartupGlobe } from "@/components/ui/startup-globe";
import { pins } from "@/lib/data";

export default function GlobePage() {
  return <StartupGlobe items={pins} aria-label="Startups on the globe" />;
}
