import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, Flag, Heart, Quote, Users } from "lucide-react";
import { Illustration } from "@/components/school/Illustration";
import { PageHero } from "@/components/school/PageHero";
import { Reveal } from "@/components/school/Reveal";
import { administrationAndStaff, values } from "@/lib/site-content";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({ head: () => ({ meta: [
  { title: "About Us — Annointed comprehensive high school" }, { name: "description", content: "Learn about the mission, vision, values, administration, staff and faith-informed ethos of Annointed comprehensive high school in Uyo." },
  { property: "og:title", content: "About Annointed comprehensive high school" }, { property: "og:description", content: "A learning community grounded in faith, character and excellent teaching." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: AboutPage });

const categories = ["All", "Administration", "Academic Leadership", "Teaching Staff"] as const;

function AboutPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const displayedStaff = activeCategory === "All"
    ? administrationAndStaff
    : administrationAndStaff.filter((member) => member.category === activeCategory);

  return (
    <>
      <PageHero eyebrow="Our story" title="Rooted in grace. Growing with purpose." intro="We are building a school community where every learner is known, every gift is nurtured and education prepares young people to serve with wisdom and courage." />
      
      <section className="section-pad">
        <div className="page-shell grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] border border-border shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
                alt="Students collaborating at Annointed comprehensive high school"
                className="h-full min-h-[400px] w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal>
            <p className="eyebrow text-primary">Who we are</p>
            <h2 className="section-title mt-4">A school shaped around the whole child.</h2>
            <p className="mt-6 text-base leading-8 text-muted-foreground">Annointed comprehensive high school is an inspiring educational community in Uyo: welcoming in spirit, ambitious in learning and grounded in Christian values.</p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">From creche and nursery to primary and secondary levels, our dedicated faculty and administrators work hand-in-hand to cultivate brilliance, curiosity, and godly character in every child.</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-soft section-pad">
        <div className="page-shell grid gap-5 md:grid-cols-2">
          <Reveal className="statement-block">
            <Flag className="h-8 w-8 text-gold-deep" />
            <p className="eyebrow mt-8 text-primary">Our mission</p>
            <h2 className="mt-4 font-display text-3xl text-primary sm:text-4xl">To nurture capable minds, compassionate hearts and courageous faith.</h2>
            <p className="mt-5 leading-7 text-muted-foreground">We create meaningful learning experiences that equip every child with knowledge, character, discipline and confidence.</p>
          </Reveal>
          <Reveal className="statement-block statement-block--dark">
            <Eye className="h-8 w-8 text-gold" />
            <p className="eyebrow mt-8 text-gold">Our vision</p>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl">Young people prepared to shine, serve and shape their world.</h2>
            <p className="mt-5 leading-7 text-primary-foreground/70">To raise a generation of excellent, grounded and resourceful leaders from Akwa Ibom to the nation and the world.</p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <div className="page-shell">
          <Reveal>
            <p className="eyebrow text-primary">The values we live</p>
            <h2 className="section-title mt-4">Our everyday compass.</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ title, text, icon: Icon }) => (
              <Reveal key={title} className="value-item">
                <Icon />
                <h3>{title}</h3>
                <p>{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Administration and Staff Section */}
      <section className="section-pad bg-soft">
        <div className="page-shell">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-primary flex items-center gap-2">
                <Users className="h-4 w-4 text-gold-deep" /> Leadership & Faculty
              </p>
              <h2 className="section-title mt-4">Administration & Staff</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Meet the experienced leaders, administrators, and dedicated teachers shaping excellence, discipline, and warmth across all sections.
            </p>
          </Reveal>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "cursor-pointer rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-background text-muted-foreground hover:bg-gold-soft hover:text-primary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Staff Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayedStaff.map(({ name, role, department, image, initials, bio, accent }) => (
              <Reveal key={name} className="staff-card">
                <div className="flex items-center gap-4">
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="h-14 w-14 shrink-0 rounded-full object-cover border-2 border-gold/40 shadow-sm"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-lg font-bold shadow-inner ${accent}`}>
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="block text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground">{department}</span>
                    <h3 className="truncate font-display text-lg font-bold text-primary" title={name}>{name}</h3>
                  </div>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gold-deep">{role}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{bio}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-gold-soft">
        <div className="page-shell grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border-4 border-gold/30 shadow-xl min-h-[360px] max-h-[460px]">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=80"
                alt="Leadership of Annointed comprehensive high school"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent p-5 text-primary-foreground">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-gold">Proprietress & Director</span>
                <p className="font-display text-lg font-bold leading-tight">Dr. / Pastor (Mrs.) E. Akpan</p>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <Quote className="h-9 w-9 text-gold-deep" />
            <blockquote className="mt-5 font-display text-3xl leading-snug text-primary sm:text-4xl">
              “Education is more than what a child knows. It is who they are becoming, and how confidently they learn to use their gifts.”
            </blockquote>
            <p className="mt-6 font-bold text-primary">Office of the Proprietress & Principal</p>
            <p className="text-sm text-muted-foreground">Annointed comprehensive high school, Uyo</p>
          </Reveal>
        </div>
      </section>

      <section className="section-pad">
        <Reveal className="page-shell max-w-4xl text-center">
          <Heart className="mx-auto h-8 w-8 text-coral" />
          <p className="eyebrow mt-5 text-primary">Our faith-based ethos</p>
          <h2 className="section-title mt-4">Grace is not just in our name.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
            It shapes how we teach, lead, forgive, encourage and serve. Children are invited to grow in gratitude and purpose while learning to respect the dignity of every person.
          </p>
        </Reveal>
      </section>
    </>
  );
}