import { School, Building, ShieldCheck, GraduationCap, Globe2, Compass, Sparkles } from "lucide-react";

function LogoMark({ icon: Icon, name }: { icon: any; name: string }) {
  return (
    <div className="flex h-10 shrink-0 items-center gap-2.5 px-4 py-2 rounded-xl border bg-card/60 backdrop-blur-sm text-foreground/80 font-bold text-sm shadow-xs transition-colors hover:border-primary/40 hover:text-foreground">
      <Icon className="h-4 w-4 text-primary" />
      <span>{name}</span>
    </div>
  );
}

const institutions = [
  { name: "Oakridge Academy", icon: School },
  { name: "St. Jude Collegiate", icon: GraduationCap },
  { name: "Horizon Global School", icon: Globe2 },
  { name: "Beacon Prep Institute", icon: Building },
  { name: "Apex Science Charter", icon: Sparkles },
  { name: "Metropolitan High", icon: ShieldCheck },
  { name: "Pinnacle International", icon: Compass },
];

export function LogoCloud() {
  return (
    <section className="w-full bg-muted/20 py-12 md:py-16 border-y" aria-label="Institutions that trust School Pro">
      <p className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Trusted by 500+ K-12 Schools, Colleges & Education Districts
      </p>

      <div className="marquee-pause relative mt-8 overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max animate-marquee items-center gap-8 pr-8">
          {institutions.map((item, i) => (
            <LogoMark key={`a-${i}`} icon={item.icon} name={item.name} />
          ))}
          {/* Duplicate for seamless infinite loop */}
          {institutions.map((item, i) => (
            <LogoMark key={`b-${i}`} icon={item.icon} name={item.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
