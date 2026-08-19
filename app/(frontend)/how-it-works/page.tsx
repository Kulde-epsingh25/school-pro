import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Shield, Zap, Sparkles, School, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "How It Works - School Pro",
  description: "Learn how School Pro simplifies campus operations in four easy steps."
};

const steps = [
  {
    number: "01",
    title: "Instant Tenant Onboarding",
    description: "Create your school workspace in under 60 seconds with custom branding, subdomain, and administrator credentials.",
    icon: School
  },
  {
    number: "02",
    title: "Granular RBAC & Data Setup",
    description: "Import student rosters, staff, classrooms, and configure dynamic access permissions tailored to your institution.",
    icon: Shield
  },
  {
    number: "03",
    title: "Activate Dedicated Portals",
    description: "Give teachers, students, parents, vendors, and alumni instant access to real-time portals and notifications.",
    icon: Users
  },
  {
    number: "04",
    title: "Automate Finances & Reports",
    description: "Collect online tuition fees, track inventory depreciation, generate automated report cards, and monitor live bus GPS.",
    icon: DollarSign
  }
];

export default function HowItWorksPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
          Simple & Scalable
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          How School Pro Transforms Your Campus
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          From first-time setup to daily automated workflows, discover why over 100+ institutions rely on School Pro to unify academics, operations, and community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((s, idx) => (
          <div key={idx} className="bg-card border rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-indigo-500 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-extrabold text-indigo-600/30 font-mono">{s.number}</span>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                  <s.icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-3xl p-10 text-center space-y-6 shadow-xl">
        <h2 className="text-3xl font-bold">Ready to modernize your institution?</h2>
        <p className="text-indigo-100 max-w-xl mx-auto text-sm">
          Get started today with full access to our multi-tenant suite, intelligent gradebooks, automated admissions, and mobile portals.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/onboarding">
            <Button size="lg" className="bg-white text-indigo-950 hover:bg-indigo-50 font-bold px-8">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold">
              Sign In to Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
