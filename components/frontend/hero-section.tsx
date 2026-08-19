import { ArrowRight, Sparkles, ShieldCheck, School, Users, CheckCircle2, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] w-full flex items-center justify-center overflow-hidden py-16 px-4">
      {/* Background Gradients & Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-background to-background dark:from-blue-950/20 dark:via-background dark:to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/20 via-indigo-500/20 to-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center text-center space-y-8">
        
        {/* Top Innovation Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold shadow-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
          <span>Next-Generation Multi-Tenant School ERP & LMS</span>
          <span className="hidden sm:inline bg-blue-600 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">2026 Edition</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-4 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.08]">
            Complete Operating System for{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Modern Institutions
            </span>
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From smart admissions, biometric IoT attendance, and live GPS bus tracking to report cards and multi-child family billing — all in one unified platform.
          </p>
        </div>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Link href="/onboarding">
            <Button size="lg" className="h-12 px-8 rounded-full text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 gap-2">
              Start Free School Setup <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/portal">
            <Button size="lg" variant="outline" className="h-12 px-7 rounded-full text-base font-semibold border-border hover:bg-muted gap-2">
              <School className="h-4 w-4 text-indigo-600" /> Explore Portals
            </Button>
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 w-full max-w-4xl">
          {[
            { title: "IoT Biometrics & GPS", desc: "Real-time roll call & live bus telemetry" },
            { title: "Multi-Role Portals", desc: "Students, Parents, Teachers & Alumni" },
            { title: "Automated Fee Ledger", desc: "Online payments & PDF receipts" },
            { title: "Zero-Trust HIPAA / FERPA", desc: "Isolated multi-tenant architecture" }
          ].map((item, i) => (
            <div key={i} className="bg-card/70 backdrop-blur-sm border rounded-2xl p-4 text-left shadow-sm space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                {item.title}
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
