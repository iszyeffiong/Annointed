import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Maximize2, X } from "lucide-react";
import { PageHero } from "@/components/school/PageHero";
import { Reveal } from "@/components/school/Reveal";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Annointed comprehensive high school" },
      {
        name: "description",
        content:
          "Explore moments of learning, creativity, sports, science and community life at Annointed comprehensive high school in Uyo.",
      },
      { property: "og:title", content: "Gallery — Annointed comprehensive high school" },
      {
        property: "og:description",
        content: "Moments of curiosity, creativity and school community.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

type GalleryItem = {
  title: string;
  label: string;
  image: string;
  className?: string;
  description: string;
};

const gallery: GalleryItem[] = [
  {
    title: "Curious minds engaged in learning",
    label: "Classroom life",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    className: "gallery-tile--wide",
    description: "Active class discussions and collaborative learning in progress.",
  },
  {
    title: "Colour, rhythm and creative expression",
    label: "Creative arts",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80",
    description: "Visual arts, painting, and cultural handicraft projects.",
  },
  {
    title: "Joyful friendships and mutual care",
    label: "Community",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80",
    className: "gallery-tile--tall",
    description: "Building character, camaraderie, and lifelong school memories.",
  },
  {
    title: "Storytelling opens new horizons",
    label: "Reading & Library",
    image:
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80",
    description: "Cultivating independent literacy habits and library research.",
  },
  {
    title: "Confidence, fitness and teamwork",
    label: "Sports & Athletics",
    image:
      "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1000&q=80",
    description: "Physical education, track events, and team tournaments.",
  },
  {
    title: "Voices lifted in praise and harmony",
    label: "Music & Choir",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80",
    className: "gallery-tile--wide",
    description: "Vocal training, choir recitals, and musical instruments.",
  },
  {
    title: "Hands-on scientific discovery & STEM",
    label: "Science Lab",
    image:
      "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=80",
    description: "Interactive science experiments and digital coding sessions.",
  },
  {
    title: "Gentle nurture and early discovery",
    label: "Early Years & Creche",
    image:
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
    description: "Loving early childhood care and sensory exploration.",
  },
];

function GalleryPage() {
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Campus Gallery"
        title="A glimpse of vibrant life at Annointed."
        intro="Explore photographic glimpses of academic exploration, cultural creativity, athletic achievements, and joyful community life across all school tiers."
      />

      <section className="section-pad">
        <div className="page-shell">
          <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-primary flex items-center gap-2">
                <Camera className="h-4 w-4 text-gold-deep" /> Everyday Moments
              </p>
              <h2 className="section-title mt-4">Memories worth remembering.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Click any photo to view full resolution. These representative images showcase the vibrant energy and warmth of our academy until the school's official photos are added.
            </p>
          </Reveal>

          <div className="gallery-grid mt-10">
            {gallery.map((item, index) => (
              <Reveal key={item.title}>
                <div
                  onClick={() => setActiveItem(item)}
                  className={`group relative flex min-h-[18rem] cursor-pointer flex-col justify-end overflow-hidden rounded-3xl border border-border bg-muted p-6 shadow-sm transition-all duration-300 hover:scale-[0.99] hover:shadow-xl ${item.className || ""}`}
                >
                  {/* Background Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/45 to-transparent" />

                  {/* Expand icon */}
                  <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-primary backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Maximize2 className="h-4 w-4" />
                  </span>

                  {/* Number tag */}
                  <span className="relative z-10 font-display text-sm font-bold text-gold">
                    0{index + 1}
                  </span>

                  {/* Captions */}
                  <div className="relative z-10 mt-2">
                    <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-gold">
                      {item.label}
                    </p>
                    <h3 className="mt-1 font-display text-xl font-bold text-primary-foreground sm:text-2xl">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-card p-4 shadow-2xl md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute right-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white hover:bg-gold hover:text-ink cursor-pointer"
              aria-label="Close image lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="aspect-[16/10] max-h-[65vh] w-full overflow-hidden rounded-2xl bg-black">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gold-deep">
                  {activeItem.label}
                </span>
                <h3 className="font-display text-xl font-bold text-primary sm:text-2xl">
                  {activeItem.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm">
                {activeItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}