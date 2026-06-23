function LogoMark({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-2 text-muted-foreground/60">
      {children}
    </div>
  )
}

const logos = [
  <LogoMark key="1">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 18L9 6l3 6 3-6 6 12H3z" fill="currentColor" />
    </svg>
    <span className="text-lg font-bold italic tracking-tight">ipsum</span>
  </LogoMark>,
  <LogoMark key="2">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
    <span className="text-lg font-semibold tracking-tight">Logoipsum</span>
  </LogoMark>,
  <LogoMark key="3">
    <span className="text-lg font-extrabold italic tracking-tight">
      logo<span className="font-black">ipsum</span>
      <sup className="text-destructive/50">+</sup>
    </span>
  </LogoMark>,
  <LogoMark key="4">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l8 3v6c0 5-3.5 8-8 11-4.5-3-8-6-8-11V5l8-3z" fill="currentColor" />
    </svg>
    <span className="text-lg font-bold tracking-tight">Logoipsum</span>
  </LogoMark>,
  <LogoMark key="5">
    <span className="text-lg font-medium tracking-tight">logo</span>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
    <span className="text-lg font-medium tracking-tight">ipsum</span>
  </LogoMark>,
  <LogoMark key="6">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" stroke="currentColor" strokeWidth="1.5" />
    </svg>
    <span className="text-base font-semibold leading-none tracking-tight">logo&mdash;ipsum</span>
  </LogoMark>,
  <LogoMark key="7">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 18L9 6l3 6 3-6 6 12H3z" fill="currentColor" />
    </svg>
    <span className="text-lg font-black italic tracking-tighter">ipsum</span>
  </LogoMark>,
]

export function LogoCloud() {
  return (
    <section className="w-full bg-background py-12 md:py-16" aria-label="Companies that trust us">
      <p className="text-center text-sm font-medium text-muted-foreground">
        Trusted by 500+ production companies
      </p>

      <div className="marquee-pause relative mt-8 overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max animate-marquee items-center gap-16 pr-16">
          {logos.map((logo, i) => (
            <div key={`a-${i}`}>{logo}</div>
          ))}
          {/* Duplicate for seamless loop */}
          {logos.map((logo, i) => (
            <div key={`b-${i}`} aria-hidden="true">
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
