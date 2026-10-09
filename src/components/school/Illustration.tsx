import { BookOpen, FlaskConical, Music2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Illustration({ variant = "campus", className }: { variant?: "campus" | "learning" | "community"; className?: string }) {
  return (
    <div className={cn("illustration relative overflow-hidden", className)} aria-hidden="true">
      <div className="illustration-sun"><Sparkles /></div>
      <div className="illustration-arch illustration-arch--left" />
      <div className="illustration-arch illustration-arch--right" />
      <div className="illustration-ground" />
      <div className="illustration-building">
        <div className="illustration-roof" />
        <div className="illustration-window" />
        <div className="illustration-door" />
      </div>
      <div className="illustration-badge">
        {variant === "learning" ? <FlaskConical /> : variant === "community" ? <Music2 /> : <BookOpen />}
      </div>
      <div className="illustration-dots" />
    </div>
  );
}