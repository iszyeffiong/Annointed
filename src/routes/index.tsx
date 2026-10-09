import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/school/BrandMark";
import { Illustration } from "@/components/school/Illustration";
import { Reveal } from "@/components/school/Reveal";
import { highlights, programmes, values } from "@/lib/site-content";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Annointed comprehensive high school — Faith, Learning & Character in Uyo" },
    { name: "description", content: "Discover a warm, faith-informed school community serving children from creche and nursery through primary and secondary school in Uyo." },
    { property: "og:title", content: "Annointed comprehensive high school — Uyo" },
    { property: "og:description", content: "A place to belong, believe and become." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: HomePage,
});

function HomePage() {
  const [intro, setIntro] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let timer: number | undefined;
    if (!sessionStorage.getItem("annointed-intro")) {
      setIntro(true); sessionStorage.setItem("annointed-intro", "seen");
      timer = window.setTimeout(() => setIntro(false), 7000);
    }
    return () => { if (timer !== undefined) window.clearTimeout(timer); };
  }, []);
  const move = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    heroRef.current?.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    heroRef.current?.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };
  return <>
    {intro && <div className="preloader" aria-label="Loading Annointed comprehensive high school"><BrandMark className="h-24 w-24" /><p>Annointed comprehensive high school</p><span>A place to belong · believe · become</span><i /></div>}
    <section ref={heroRef} onPointerMove={move} className="home-hero texture-grid relative overflow-hidden">
      <div className="hero-spotlight" />
      {/* Ambient rounded luminous glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-12 -left-20 h-80 w-80 rounded-full bg-sky-soft/10 blur-3xl" />
      <div className="page-shell relative grid min-h-[calc(100svh-5rem)] items-center gap-10 py-14 lg:grid-cols-[1.04fr_.96fr] lg:py-20">
        <div className="relative z-10 max-w-3xl animate-fade-in">
          <p className="eyebrow text-gold">Growing bright futures in Uyo</p>
          <h1 className="mt-5 font-display text-[clamp(3.4rem,7vw,7.2rem)] leading-[.92] text-primary-foreground">Belong.<br /><em className="font-normal text-gold">Believe.</em><br />Become.</h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-primary-foreground/75">A warm, faith-informed school where thoughtful teaching, strong character and joyful discovery help every child flourish.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-13 bg-gold px-6 text-ink hover:bg-gold/90"><Link to="/admissions">Explore admissions <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline" className="h-13 border-primary-foreground/30 bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10"><Link to="/academics">See our programmes</Link></Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-gold/30 shadow-2xl min-h-[390px] lg:min-h-[520px]">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80"
            alt="Students thriving at Annointed comprehensive high school"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl bg-background/95 p-4 shadow-lg backdrop-blur-md">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-gold-deep">Faith · Learning · Character</span>
              <p className="font-display text-base font-bold text-primary">A joyful place to belong and flourish</p>
            </div>
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">Creche – Secondary</span>
          </div>
        </div>
      </div>
      <div className="page-shell relative z-10 grid grid-cols-3 border-t border-primary-foreground/15 py-5">
        {highlights.map(({ value, label }) => <div key={label} className="border-r border-primary-foreground/15 px-3 text-center last:border-0"><strong className="font-display text-2xl text-gold sm:text-3xl">{value}</strong><span className="mt-1 block text-[0.62rem] uppercase tracking-[0.16em] text-primary-foreground/55 sm:text-xs">{label}</span></div>)}
      </div>
    </section>
    <section className="section-pad"><div className="page-shell">
      <Reveal className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end"><div><p className="eyebrow text-primary">One school, every stage</p><h2 className="section-title mt-4">Room to grow,<br />year after year.</h2></div><p className="section-intro lg:justify-self-end">From a child's first confident steps into a classroom to their preparation for life beyond school, learning is designed as one thoughtful journey.</p></Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-3">{programmes.map(({ title, ages, description, icon: Icon, accent }, index) => <Reveal key={title} className="programme-card"><div className={`programme-icon ${accent}`}><Icon /></div><span className="card-number">0{index + 1}</span><p className="mt-8 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{ages}</p><h3 className="mt-2 font-display text-3xl text-primary">{title}</h3><p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p><Link to="/academics" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">Discover the level <ArrowRight className="h-4 w-4" /></Link></Reveal>)}</div>
    </div></section>
    <section className="section-pad bg-soft"><div className="page-shell grid gap-12 lg:grid-cols-2 lg:items-center"><Reveal><div className="relative overflow-hidden rounded-[2.5rem] border border-border shadow-lg min-h-[420px]"><img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80" alt="Dedicated classroom instruction at Annointed comprehensive high school" className="h-full w-full object-cover" loading="lazy" /></div></Reveal><Reveal><p className="eyebrow text-primary">Why families choose Annointed</p><h2 className="section-title mt-4">Education with heart and direction.</h2><p className="mt-6 text-base leading-8 text-muted-foreground">We believe children thrive when they are known, encouraged and challenged. Our approach brings academic foundations together with the habits and values that last a lifetime.</p><ul className="mt-7 grid gap-4">{["Purposeful teaching and individual attention", "A safe, caring and disciplined environment", "Faith and character woven into daily school life", "Creative, practical and future-ready learning"].map((text) => <li key={text} className="flex items-start gap-3 text-sm font-semibold"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-soft text-primary"><Check className="h-3.5 w-3.5" /></span>{text}</li>)}</ul><Button asChild variant="outline" className="mt-8 h-12"><Link to="/about">Our story and values <ArrowRight /></Link></Button></Reveal></div></section>
    <section className="section-pad"><div className="page-shell"><Reveal className="text-center"><p className="eyebrow text-primary">Our compass</p><h2 className="section-title mx-auto mt-4 max-w-2xl">What shapes an Annointed learner.</h2></Reveal><div className="mt-10 grid gap-px overflow-hidden rounded-3xl border bg-border sm:grid-cols-2 lg:grid-cols-4">{values.map(({ title, text, icon: Icon }) => <Reveal key={title} className="bg-background p-7"><Icon className="h-7 w-7 text-gold-deep" /><h3 className="mt-8 font-display text-2xl text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></Reveal>)}</div></div></section>
    <section className="bg-primary py-16 text-primary-foreground"><Reveal className="page-shell grid gap-8 md:grid-cols-[1fr_auto] md:items-center"><div><Quote className="h-8 w-8 text-gold" /><blockquote className="mt-5 max-w-3xl font-display text-3xl leading-snug sm:text-4xl">“My child comes home curious, confident and excited to share what was learned.”</blockquote><p className="mt-4 text-sm text-primary-foreground/60">Sample parent testimonial · Placeholder content</p></div><Button asChild size="lg" className="h-12 bg-gold text-ink hover:bg-gold/90"><Link to="/admissions">Start your journey <ArrowRight /></Link></Button></Reveal></section>
  </>;
}