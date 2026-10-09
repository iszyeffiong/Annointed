import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Facebook, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/school/PageHero";
import { Reveal } from "@/components/school/Reveal";
import { school } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({ head: () => ({ meta: [
  { title: "Contact — Annointed comprehensive high school" }, { name: "description", content: "Find Annointed comprehensive high school on Anita Street (by Basumoh Gas Plant) in Uyo or contact +234 814 602 5178." },
  { property: "og:title", content: "Contact Annointed comprehensive high school" }, { property: "og:description", content: "Visit or send an enquiry to our school community in Uyo." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: ContactPage });

function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <>
    <PageHero eyebrow="Contact us" title="Come and get to know us." intro="Whether you are exploring admission, planning a visit or simply have a question, we would be glad to hear from you." />
    <section className="section-pad"><div className="page-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><Reveal><p className="eyebrow text-primary">Reach the school</p><h2 className="section-title mt-4">We are here to help.</h2><div className="mt-8 grid gap-4"><ContactItem icon={MapPin} label="Visit" value={`${school.address}, ${school.location}`} /><ContactItem icon={Phone} label="Phone" value={school.phone} href={`tel:${school.phone.replace(/\s+/g, '')}`} /><ContactItem icon={Mail} label="Email" value={school.email} href={`mailto:${school.email}`} /><ContactItem icon={MessageCircle} label="WhatsApp" value={school.phone} href="https://wa.me/2348146025178" /></div><a href={school.facebook} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-gold"><Facebook className="h-5 w-5" /> Follow Annointed on Facebook</a><div className="mt-9 border-l-4 border-gold rounded-r-2xl bg-background p-5 shadow-xs"><p className="font-bold text-primary">Opening hours</p><p className="mt-2 text-sm text-muted-foreground">Monday – Friday: 7:30 AM – 4:00 PM</p></div></Reveal><Reveal className="form-panel">{sent ? <div className="flex min-h-96 flex-col items-center justify-center text-center" role="status"><CheckCircle2 className="h-12 w-12 text-primary" /><h2 className="mt-5 font-display text-3xl text-primary">Message captured</h2><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Thank you for reaching out. We will get back to you shortly.</p><Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Write another</Button></div> : <form onSubmit={submit} className="grid gap-5"><div><p className="eyebrow text-primary">Send a message</p><h2 className="mt-3 font-display text-3xl text-primary">What would you like to know?</h2></div><label className="form-label">Full name<Input required placeholder="Your name" /></label><label className="form-label">Email address<Input required type="email" placeholder="you@example.com" /></label><label className="form-label">Message<Textarea required className="min-h-36 rounded-2xl" placeholder="Write your message here" /></label><Button type="submit" size="lg" className="h-12 sm:justify-self-start">Send message <Send /></Button><p className="text-xs leading-5 text-muted-foreground">We respond promptly to all admission inquiries and parent messages.</p></form>}</Reveal></div></section>
    <section className="pb-20"><div className="page-shell"><Reveal className="map-placeholder"><div className="map-roads" /><MapPin className="relative h-12 w-12 text-coral" /><div className="relative"><p className="font-display text-2xl text-primary">Anita Street (by Basumoh Gas Plant)</p><p className="mt-1 text-sm text-muted-foreground">Uyo, Akwa Ibom State, Nigeria</p></div></Reveal></div></section>
  </>;
}

function ContactItem({ icon: Icon, label, value, href }: { icon: typeof MapPin; label: string; value: string; href?: string }) {
  return (
    <div className="contact-item">
      <span><Icon /></span>
      <div>
        <p>{label}</p>
        {href ? (
          <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="mt-1 inline-block font-semibold text-primary hover:text-gold transition-colors">
            {value}
          </a>
        ) : (
          <strong>{value}</strong>
        )}
      </div>
    </div>
  );
}