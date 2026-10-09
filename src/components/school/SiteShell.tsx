import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, Facebook, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { school } from "@/lib/site-content";
import { BrandMark } from "./BrandMark";

const links = [
  { to: "/about" as const, label: "About" },
  { to: "/academics" as const, label: "Academics" },
  { to: "/admissions" as const, label: "Admissions" },
  { to: "/gallery" as const, label: "Gallery" },
  { to: "/news" as const, label: "News & Blog" },
  { to: "/contact" as const, label: "Contact" },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="site-header">
        <div className="page-shell grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 lg:h-24">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Annointed comprehensive high school home">
            <BrandMark className="h-11 w-11 shrink-0" />
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-semibold leading-tight text-primary lg:text-xl">Annointed comprehensive</span>
              <span className="block text-[0.64rem] font-bold uppercase tracking-[0.24em] text-muted-foreground">Academy · Uyo</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 xl:flex" aria-label="Main navigation">
            {links.map((item) => (
              <Link key={item.to} to={item.to} className="nav-link" activeProps={{ className: "nav-link nav-link--active" }}>{item.label}</Link>
            ))}
            <Button asChild className="h-11 bg-primary px-5 text-primary-foreground hover:bg-primary/90">
              <Link to="/admissions">Enquire <ArrowUpRight /></Link>
            </Button>
          </nav>
          <Button variant="ghost" size="icon" className="h-11 w-11 xl:hidden" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
            {open ? <X /> : <Menu />}
          </Button>
        </div>
        <div id="mobile-menu" className={open ? "mobile-menu mobile-menu--open" : "mobile-menu"} aria-hidden={!open}>
          <nav className="page-shell flex flex-col py-6" aria-label="Mobile navigation">
            {links.map((item, index) => <Link key={item.to} to={item.to} tabIndex={open ? 0 : -1} className="mobile-nav-link"><span>0{index + 1}</span>{item.label}</Link>)}
            <Button asChild className="mt-6 h-12"><Link to="/admissions" tabIndex={open ? 0 : -1}>Begin an enquiry <ArrowUpRight /></Link></Button>
          </nav>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="bg-primary text-primary-foreground">
        <div className="page-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3"><BrandMark className="h-12 w-12" /><p className="font-display text-xl">{school.name}</p></div>
            <p className="mt-5 text-sm leading-7 text-primary-foreground/70">A nurturing learning community where faith, character and excellent teaching help every child flourish.</p>
          </div>
          <div>
            <p className="footer-title">Explore</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-primary-foreground/70">
              {links.map((item) => <Link key={item.to} to={item.to} className="hover:text-gold">{item.label}</Link>)}
            </div>
          </div>
          <div>
            <p className="footer-title">Find us</p>
            <p className="mt-4 flex gap-2 text-sm leading-6 text-primary-foreground/70"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />{school.address}<br />{school.location}</p>
            <p className="mt-3 flex gap-2 text-sm leading-6 text-primary-foreground/70"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><a href={`tel:${school.phone.replace(/\s+/g, '')}`} className="hover:text-gold">{school.phone}</a></p>
            <p className="mt-2 flex gap-2 text-sm leading-6 text-primary-foreground/70"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" /><a href={`mailto:${school.email}`} className="hover:text-gold">{school.email}</a></p>
            <a href={school.facebook} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm hover:text-gold"><Facebook className="h-4 w-4" /> Facebook</a>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10">
          <div className="page-shell flex flex-col gap-2 py-5 text-xs text-primary-foreground/50 sm:flex-row sm:justify-between items-center">
            <span>© 2026 Annointed comprehensive high school</span>
            <div>
              <span>Official Academy Portal</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}