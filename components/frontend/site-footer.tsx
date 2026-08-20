"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import Link from "next/link";
import Logo from "./logo";
import { toast } from "sonner";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Subscribed to School Pro updates!", {
      description: "You'll receive quarterly release notes and institutional best practices."
    });
    setEmail("");
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-100 border-t border-slate-800">
      <div className="container mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & Social */}
          <div className="space-y-4">
            <div className="bg-white/95 p-2 rounded-xl inline-block">
              <Logo />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Trusted by 500+ schools worldwide, School Pro is the unified multi-tenant institutional operating system that streamlines administration, automates biometrics, and connects parents with educators.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-slate-800 p-2.5 hover:bg-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FaXTwitter className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-slate-800 p-2.5 hover:bg-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-slate-800 p-2.5 hover:bg-primary hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-slate-800 p-2.5 hover:bg-primary hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Direct Contact */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide">Institutional Support</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a href="mailto:support@schoolpro.com" className="hover:text-white transition-colors">
                  support@schoolpro.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <a href="tel:+18005550199" className="hover:text-white transition-colors">
                  +1 (800) 555-0199
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>100 Innovation Parkway, Suite 400<br />Boston, MA 02110</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide">Platform Links</h3>
            <nav className="flex flex-col space-y-2 text-sm text-slate-400">
              <Link className="hover:text-white transition-colors" href="/">
                Home Overview
              </Link>
              <Link className="hover:text-white transition-colors" href="/pricing">
                Pricing & Plans
              </Link>
              <Link className="hover:text-white transition-colors" href="/how-it-works">
                How It Works & Architecture
              </Link>
              <Link className="hover:text-white transition-colors" href="/portal">
                Portals Hub (Parent/Student/Staff)
              </Link>
              <Link className="hover:text-white transition-colors" href="/contact-us">
                Request Consultation
              </Link>
              <Link className="hover:text-white transition-colors" href="/help">
                Knowledge Base & FAQs
              </Link>
              <Link className="hover:text-white transition-colors" href="/onboarding">
                School Setup (Admin Portal)
              </Link>
            </nav>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white tracking-wide">School Leadership Brief</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to our monthly brief on AI in education, biometrics compliance, and student data safety.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary h-10"
                placeholder="principal@school.edu"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button
                className="w-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 h-10"
                type="submit"
              >
                {subscribed ? "Subscribed!" : "Subscribe"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="container mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 School Pro Systems Inc. All Rights Reserved.
          </div>
          <div className="flex gap-6">
            <Link href="/help" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/help" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/help" className="hover:text-slate-300">FERPA & HIPAA Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
