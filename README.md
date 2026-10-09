# Rema Academy Portal

Product Requirements Document

Annointed comprehensive high school — School Website

Version: 1.0 (Draft) Date: September 21, 2026 Prepared for: Annointed comprehensive high school, Uyo, Akwa Ibom State, Nigeria

1. Overview

Annointed comprehensive high school needs a public website that introduces the school to prospective parents and students, communicates its academic offering and values, and gives visitors an easy way to get in touch or begin the admissions process. The site will launch with placeholder ("dummy") copy and imagery that the school can swap for real photos, staff bios, and results once available.

School details on record:

FieldValueNameAnnointed comprehensive high schoolAddressGoodluck Ebele Jonathan Boulevard, Uyo, 0052City / CountryUyo, Akwa Ibom State, NigeriaSocialFacebook — facebook.com/remagga

2. Goals & Success Criteria

Build credibility — a modern, warm, professionally designed site that reassures parents the school is well-run and cares about pupils.

Communicate the academic offering — clear breakdown of levels taught (Creche/Nursery, Primary, Secondary), curriculum, and values.

Drive enquiries — a clear, low-friction path to contact the school or start an admission enquiry (phone, WhatsApp/email, contact form).

Be memorable — a distinctive first-load experience (an intro/loading animation) plus tasteful interactive motion that feels premium without being distracting.

Work everywhere — fully responsive across mobile, tablet, and desktop, since most Nigerian visitors will arrive on a phone.

Success looks like: a visitor can, within 3 clicks from landing, understand what the school offers and find a way to contact/enquire.

3. Audience

Primary: Parents/guardians in Uyo and Akwa Ibom State researching schools for their children.

Secondary: Prospective staff/teachers researching the school; current parents looking up term dates/events; alumni.

4. Site Map (Multi-page)

The site will feel like a true multi-page site (distinct URLs/sections, own layout and content per page), navigable from a persistent header and footer.

Home — hero introduction, loading intro, highlights (why choose us), quick stats, featured programs, testimonial teaser, call-to-action to Admissions.

About — school history/mission/vision/core values, leadership message (Proprietor/Head Teacher), faith-based ethos.

Academics — levels offered (Creche, Nursery, Primary, Secondary), curriculum approach, subjects, extracurriculars/clubs.

Admissions — how to apply, requirements/checklist, fees enquiry note, step-by-step process, enquiry/application form.

Gallery — placeholder photo grid of campus life, events, classrooms (dummy imagery).

News & Events — placeholder blog-style cards (announcements, resumption dates, events).

Contact — address with map placeholder, phone/email/WhatsApp, contact form, social links (Facebook), opening hours.

(Optional future page: Staff Directory / Careers — flagged as "Phase 2", not built now.)

5. Key Experience Requirements

5.1 Preloader / First-load animation

A short (1–2.5s) branded loading sequence plays before the Home page is revealed (logo/monogram build-in or animated progress, school name, tagline).

Skips automatically once assets are ready; never blocks longer than ~3s.

Only shown once per session (not on internal page navigation).

5.2 Motion & interactivity

Subtle scroll-reveal animation for sections as they enter the viewport (one consistent style, not overused).

Mouse-driven interaction on the hero (e.g., a soft parallax/spotlight or custom cursor accent that responds to pointer movement) — a signature moment rather than effects scattered on every element.

Hover feedback on cards, buttons, and nav links.

All motion respects prefers-reduced-motion for accessibility.

5.3 Navigation

Sticky header with logo, page links, and a prominent "Enquire / Admissions" button.

Mobile menu (hamburger) with smooth open/close animation.

Footer repeated on every page with address, quick links, and social icon(s).

6. Content Strategy (Phase 1 — Placeholder)

All copy and images at launch are dummy/placeholder content clearly structured so the school can replace them later:

Placeholder mission/vision statements written in a warm, faith-informed tone appropriate to the school's name.

Illustrative graphics/abstract imagery in place of real student/staff photographs (to avoid using real children's photos without consent).

Sample staff quote, sample testimonials, sample events — labelled generically (e.g., "Sample Testimonial") so they're obviously placeholders internally, but presented naturally to a visitor.

7. Design Direction

Tone: warm, hopeful, trustworthy, rooted in a Nigerian/West African context — not a generic global SaaS template.

Palette: deep, confident base tones (navy/forest) with a warm gold/amber accent — reminiscent of academic gowns and West African textile colour work — on a soft paper-white background.

Type: one strong serif for display headings, one clean grotesque/sans for body and UI, to feel editorial rather than "startup."

Imagery: abstract shapes, soft gradients, iconography, and illustrated motifs rather than generic stock photography.

8. Technical Approach

Single responsive build (HTML/CSS/JS) covering all pages, so it can be delivered as one self-contained interactive site and easily hosted.

No backend required for Phase 1 — the contact/admissions form captures input client-side with a clear "message sent" confirmation state (can be wired to real email/CRM later).

Performance budget: preloader should never meaningfully delay perceived load; images/graphics kept lightweight (CSS/SVG-based rather than heavy photos) for good performance on slower Nigerian mobile connections.

Accessibility: keyboard-navigable menus, visible focus states, sufficient colour contrast, reduced-motion support.

9. Out of Scope (Phase 1)

Real photography, staff bios, verified fee schedules, and results data (to be supplied by the school later).

Payment processing for fees.

Parent/student login portal.

Multi-language support.

10. Next Step

Build the interactive prototype covering all seven pages above, with the preloader and motion/mouse effects described in Section 5, using placeholder content and graphics — ready for the school to review and swap in real content.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
