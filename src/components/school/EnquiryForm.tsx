import { useState, type FormEvent } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg bg-gold-soft p-8 text-center" role="status">
      <CheckCircle2 className="h-12 w-12 text-primary" />
      <h3 className="mt-5 font-display text-3xl text-primary">Enquiry captured</h3>
      <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">Thank you. This prototype does not send messages yet; the form is ready to connect to the school's preferred inbox.</p>
      <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>Send another</Button>
    </div>
  );

  return (
    <form onSubmit={submit} className="grid gap-5" aria-label="Admissions enquiry form">
      <div className={compact ? "grid gap-5" : "grid gap-5 sm:grid-cols-2"}>
        <Field label="Parent or guardian name"><Input required name="name" placeholder="Your full name" /></Field>
        <Field label="Phone number"><Input required name="phone" inputMode="tel" placeholder="e.g. 0800 000 0000" /></Field>
      </div>
      <div className={compact ? "grid gap-5" : "grid gap-5 sm:grid-cols-2"}>
        <Field label="Email address"><Input required type="email" name="email" placeholder="you@example.com" /></Field>
        <Field label="Level of interest">
          <select required name="level" defaultValue="" className="form-control">
            <option value="" disabled>Select a level</option><option>Creche / Nursery</option><option>Primary</option><option>Secondary</option>
          </select>
        </Field>
      </div>
      <Field label="How can we help?"><Textarea required name="message" className="min-h-32" placeholder="Tell us a little about your child and what you would like to know." /></Field>
      <Button type="submit" size="lg" className="h-12 sm:justify-self-start">Send enquiry <Send /></Button>
      <p className="text-xs leading-5 text-muted-foreground">Prototype note: submissions are confirmed on this page but are not delivered externally yet.</p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="grid gap-2 text-sm font-semibold text-foreground"><span>{label}</span>{children}</label>;
}