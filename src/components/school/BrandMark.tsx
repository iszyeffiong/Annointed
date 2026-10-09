import { cn } from "@/lib/utils";
import { school } from "@/lib/site-content";

export function BrandMark({ className, src, alt }: { className?: string; src?: string; alt?: string }) {
  const logoSrc = src || school.logo || "/logo.svg";

  return (
    <img
      src={logoSrc}
      alt={alt || `${school.name} Logo`}
      className={cn("inline-block aspect-square object-contain", className)}
      loading="eager"
      aria-hidden="true"
    />
  );
}