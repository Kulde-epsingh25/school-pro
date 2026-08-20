import { ArrowRight, Sparkles } from "lucide-react";
import SmallTitle from "./small-title";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-56px)] w-full items-center justify-center overflow-hidden bg-secondary">
      {/* Background silk texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/silk-texture.png')" }}
      />
      {/* Soft wash to keep text legible */}
      <div aria-hidden="true" className="absolute inset-0 bg-background/30" />

      <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center px-6 py-24 text-center">
        {/* Badge */}
        <SmallTitle title="Welcome to School Pro" />
        {/* Heading */}
        <h1 className="mt-8 text-balance text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Your Ultimate School Management Solution
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          From student enrollment to staff management, our platform streamlines every aspect of school administration, empowering educators and administrators to focus on what truly matters: providing an exceptional learning experience. 
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <a
            href="/onboarding"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-md ring-2 ring-background/60 transition-colors hover:bg-primary/90"
          >
            Get Started
            <ArrowRight
              className="size-4 text-destructive transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <a
            href="/portal"
            className="group inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-7 py-3.5 text-base font-semibold text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
          >
            Explore Portals
            <ArrowRight
              className="size-4 text-destructive transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
