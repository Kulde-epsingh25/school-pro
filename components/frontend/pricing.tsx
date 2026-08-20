"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PricingV1() {
  const [isAnnual, setIsAnnual] = useState(true);

  // $29/mo paid monthly = $348/yr.
  // Paid annually with 15% discount = $24/mo ($288 billed annually).
  const monthlyRate = 29;
  const annualDiscountedMonthlyRate = 24;
  const annualTotal = annualDiscountedMonthlyRate * 12; // $288/year

  const includedFeatures = [
    "Student & staff lifecycle management",
    "Academic planning & exam grading engine",
    "Automated fee collection & PDF receipts",
    "Biometric IoT attendance & leave system",
    "Real-time GPS student transport tracking",
    "Multi-channel parent & guardian alerts",
    "4D Role-based access control & FERPA security",
    "Custom institutional analytics & report export"
  ];

  return (
    <div className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center space-y-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Simple, transparent school pricing
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Everything your school needs to manage students, staff, academics, and
            finances — all in one platform. No hidden setup fees or surprise add-ons.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="mx-auto mt-10 flex justify-center items-center gap-3">
          <Button
            variant={!isAnnual ? "default" : "outline"}
            onClick={() => setIsAnnual(false)}
            className="rounded-full px-5 text-xs font-semibold"
          >
            Monthly Billing
          </Button>
          <Button
            variant={isAnnual ? "default" : "outline"}
            onClick={() => setIsAnnual(true)}
            className="rounded-full px-5 text-xs font-semibold relative"
          >
            Annual Billing
            <span className="ml-1.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] px-2 py-0.5 font-bold">
              Save 17%
            </span>
          </Button>
        </div>

        {/* Pricing Card */}
        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border bg-card/60 shadow-lg sm:mt-16 lg:mx-0 lg:flex lg:max-w-none items-stretch overflow-hidden">
          <div className="p-8 sm:p-10 lg:flex-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  All-In-One Institutional Tier
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                Complete School Enterprise License
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Get full, unrestricted access to all core modules including Student Enrollment,
                Academic Planning, Staff Payroll, GPS Bus Tracking, and Biometrics.
              </p>
              
              <div className="mt-8 flex items-center gap-x-4">
                <h4 className="flex-none text-xs font-bold uppercase tracking-wider text-primary">
                  Everything included out of the box
                </h4>
                <div className="h-px flex-auto bg-border"></div>
              </div>

              <ul
                role="list"
                className="mt-6 grid grid-cols-1 gap-3.5 text-sm leading-6 text-muted-foreground sm:grid-cols-2"
              >
                {includedFeatures.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="h-5 w-5 flex-none text-primary mt-0.5" />
                    <span className="text-foreground text-xs sm:text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-8 text-xs text-muted-foreground">
              ✓ Multi-branch support • High availability SLA • Daily cloud backups
            </p>
          </div>

          {/* Price CTA Box */}
          <div className="p-4 lg:w-full lg:max-w-md lg:flex-shrink-0 flex items-center bg-muted/40 border-t lg:border-t-0 lg:border-l">
            <div className="w-full rounded-2xl bg-card border py-8 px-6 text-center shadow-sm flex flex-col justify-between h-full">
              <div className="space-y-4">
                <p className="text-sm font-bold text-foreground">
                  {isAnnual ? "Annual Membership (Billed Annually)" : "Flexible Monthly Subscription"}
                </p>
                <div className="flex items-baseline justify-center gap-x-2">
                  <span className="text-5xl font-extrabold tracking-tight text-foreground">
                    ${isAnnual ? annualDiscountedMonthlyRate : monthlyRate}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    USD / month
                  </span>
                </div>
                {isAnnual ? (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Billed as ${annualTotal} / year (saving $60 annually)
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Billed month-to-month, cancel anytime
                  </p>
                )}
              </div>

              <div className="mt-8 space-y-3">
                <Link href="/onboarding" className="block w-full">
                  <Button className="w-full h-11 bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-full shadow-md gap-2">
                    Activate School License <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-[11px] text-muted-foreground">
                  Official invoices, W-9, and tax receipts generated automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
