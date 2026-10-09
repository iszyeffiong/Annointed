import { createFileRoute } from "@tanstack/react-router";
import { Check, ClipboardCheck, MessageCircleQuestion, School, Send } from "lucide-react";
import { EnquiryForm } from "@/components/school/EnquiryForm";
import { PageHero } from "@/components/school/PageHero";
import { Reveal } from "@/components/school/Reveal";

export const Route = createFileRoute("/admissions")({ head: () => ({ meta: [
  { title: "Admissions — Annointed comprehensive high school" }, { name: "description", content: "Learn how to enquire and apply to Annointed comprehensive high school for creche, nursery, primary or secondary school." },
  { property: "og:title", content: "Admissions at Annointed comprehensive high school" }, { property: "og:description", content: "A simple, welcoming path to joining our school community." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: AdmissionsPage });

const steps = [
  { n: "01", title: "Tell us about your child", text: "Send a short enquiry using the form below.", icon: MessageCircleQuestion },
  { n: "02", title: "Visit and meet us", text: "Arrange a conversation and school tour with our team.", icon: School },
  { n: "03", title: "Complete the application", text: "Receive the current form, requirements and fees guide.", icon: ClipboardCheck },
  { n: "04", title: "Welcome to Annointed", text: "Confirm placement and prepare for a joyful first day.", icon: Send },
];

function AdmissionsPage() { return <>
  <PageHero eyebrow="Admissions" title="Your child's next chapter can begin here." intro="Choosing a school is a meaningful decision. Our admissions journey is designed to be clear, personal and welcoming from your first question." />
  <section className="section-pad"><div className="page-shell"><Reveal><p className="eyebrow text-primary">How to apply</p><h2 className="section-title mt-4">Four simple steps.</h2></Reveal><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{steps.map(({ n, title, text, icon: Icon }) => <Reveal key={n} className="step-card"><span>{n}</span><Icon className="mt-8 h-7 w-7 text-gold-deep" /><h3 className="mt-5 font-display text-2xl text-primary">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p></Reveal>)}</div></div></section>
  <section className="section-pad bg-soft"><div className="page-shell grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><Reveal><p className="eyebrow text-primary">Before you apply</p><h2 className="section-title mt-4">A helpful checklist.</h2><div className="mt-7 grid gap-4">{["Child's birth certificate or age declaration", "Recent passport photographs", "Most recent school report, where applicable", "Transfer or health information, where applicable"].map((item) => <p key={item} className="flex gap-3 text-sm leading-6"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-soft text-primary"><Check className="h-3.5 w-3.5" /></span>{item}</p>)}</div><div className="mt-8 border-l-4 border-gold rounded-r-2xl bg-background p-5 shadow-xs"><p className="font-bold text-primary">Fees and availability</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Current fees, term dates and space availability will be shared directly by the school. No fee figures shown on this prototype are official.</p></div></Reveal><Reveal className="form-panel"><p className="eyebrow text-primary">Admission enquiry</p><h2 className="mt-3 font-display text-3xl text-primary">Tell us where your journey begins.</h2><p className="mb-7 mt-3 text-sm leading-6 text-muted-foreground">Complete the details below and the school can follow up once this form is connected.</p><EnquiryForm /></Reveal></div></section>
</>; }