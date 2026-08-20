"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MessageSquare, Search, BookOpen, ShieldCheck, Sparkles, School } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    category: "General",
    q: "What is School Pro?",
    a: "School Pro is a unified multi-tenant school management operating system and LMS. It connects admissions, IoT biometric attendance, live bus GPS tracking, fee ledger collection, and role-based portals for students, parents, and teachers."
  },
  {
    category: "Account & Access",
    q: "How do parents and students access their portals?",
    a: "Schools invite students and guardians during enrollment. Guardians receive a secure magic activation link or login credentials at /login to access real-time grades, fee statements, and bus telemetry."
  },
  {
    category: "Account & Access",
    q: "How do I reset my portal password?",
    a: "You can click 'Forgot Password' on the login screen, or request an instant password reset link from your school's super administrator or IT department."
  },
  {
    category: "Security & Compliance",
    q: "Is student data protected under FERPA & HIPAA standards?",
    a: "Yes. Every school tenant operates within isolated database schemas with end-to-end TLS encryption, strict role-based access control (RBAC), and automated compliance audit logging."
  },
  {
    category: "Billing & Licensing",
    q: "Can we pay tuition and platform licensing online?",
    a: "Yes. School Pro integrates with Stripe, PayPal, Razorpay, and regional mobile money gateways to enable one-click fee payments, automated installment plans, and downloadable PDF tax receipts."
  },
  {
    category: "Hardware & IoT",
    q: "Which biometric attendance devices and GPS trackers are supported?",
    a: "School Pro features native MQTT / WebSocket telemetry support for ZKTeco, Hikvision, and custom OBD-II GPS trackers for real-time school bus route monitoring."
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
      {/* Page Header & Live Search */}
      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
          <BookOpen className="h-4 w-4" /> Documentation & Knowledge Base
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          How can we help your school today?
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto text-base">
          Search our comprehensive knowledge base or get in touch with our institutional support engineers.
        </p>

        <div className="relative max-w-lg mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search articles, portals, biometrics, grading..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 h-12 rounded-full border bg-card text-foreground shadow-sm focus-visible:ring-primary text-sm"
          />
        </div>
      </div>

      {/* Grid Layout: FAQs + Contact Channels */}
      <div className="grid lg:grid-cols-3 gap-10 items-start">
        
        {/* Left: FAQs (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-bold text-foreground">
              Frequently Answered Questions ({filteredFaqs.length})
            </h2>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Clear filter
              </button>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center bg-card rounded-2xl border text-muted-foreground">
              No matching articles found for "{searchQuery}". Please reach out to our support team below.
            </div>
          ) : (
            <Accordion className="w-full space-y-3" defaultValue={["faq-0"]}>
              {filteredFaqs.map((faq, idx) => (
                <AccordionItem 
                  key={idx} 
                  value={`faq-${idx}`}
                  className="rounded-2xl border bg-card px-5 py-1 shadow-xs data-[state=open]:border-primary/40 transition-colors"
                >
                  <AccordionTrigger className="text-left font-semibold text-foreground text-sm sm:text-base hover:no-underline hover:text-primary">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                        {faq.category}
                      </span>
                      {faq.q}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pt-2 pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Right: Contact & Support Channels */}
        <div className="space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-xl font-bold text-foreground">Direct Support Channels</h2>
          </div>

          <div className="space-y-4">
            <a 
              href="mailto:support@schoolpro.com" 
              className="p-5 border rounded-2xl flex items-center bg-card hover:bg-muted/60 transition-all group shadow-xs hover:border-primary/40"
            >
              <div className="p-3 bg-primary/10 rounded-xl mr-4 group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors">
                <Mail size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  Email Support
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">support@schoolpro.com</p>
                <p className="text-[11px] text-primary font-medium mt-1">24/7 ticket queue</p>
              </div>
            </a>
            
            <a 
              href="tel:+18005550199" 
              className="p-5 border rounded-2xl flex items-center bg-card hover:bg-muted/60 transition-all group shadow-xs hover:border-primary/40"
            >
              <div className="p-3 bg-primary/10 rounded-xl mr-4 group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors">
                <Phone size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  Call Hotline
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">+1 (800) 555-0199</p>
                <p className="text-[11px] text-muted-foreground mt-1">Mon–Fri, 8am–6pm EST</p>
              </div>
            </a>

            <Link 
              href="/contact-us" 
              className="p-5 border rounded-2xl flex items-center bg-card hover:bg-muted/60 transition-all group shadow-xs hover:border-primary/40"
            >
              <div className="p-3 bg-primary/10 rounded-xl mr-4 group-hover:bg-primary group-hover:text-primary-foreground text-primary transition-colors">
                <MessageSquare size={22} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  Institutional Consultation
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Schedule live screen share</p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">Dedicated onboarding rep</p>
              </div>
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <ShieldCheck className="h-4 w-4" /> Enterprise Level SLA
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Active school institutions receive 99.9% uptime SLA with priority ticket escalation.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
