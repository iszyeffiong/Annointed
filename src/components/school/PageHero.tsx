import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageHero({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <section className="page-hero texture-grid relative overflow-hidden">
      {/* Ambient rounded luminous glows */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-sky-soft/10 blur-3xl" />
      <div className="page-shell relative z-10 grid gap-10 py-16 md:grid-cols-[1.15fr_.85fr] md:items-end md:py-24">
        <div className="max-w-3xl animate-fade-in">
          <p className="eyebrow text-gold">{eyebrow}</p>
          <h1 className="mt-5 font-display text-5xl leading-[1.02] text-primary-foreground sm:text-6xl lg:text-7xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/75">{intro}</p>
        </div>
        <div className="md:justify-self-end">
          {children ?? (
            <Button asChild size="lg" className="h-12 bg-gold px-6 text-ink hover:bg-gold/90">
              <Link to="/admissions">Begin an enquiry <ArrowRight /></Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}