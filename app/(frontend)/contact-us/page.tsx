import React from "react";
import ContactUsForm from "@/components/frontend/forms/contact-us-form";
import Logo from "@/components/frontend/logo";
import { MessageSquare, Headset, ShieldCheck, Sparkles } from "lucide-react";

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Header */}
      <div className="py-16 px-4 md:px-8 border-b bg-muted/20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Get Your School Management System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Ready to transform your school's digital operations? Share your requirements with us and our enterprise team will prepare a tailored demonstration.
          </p>
        </div>
      </div>

      {/* Main Form & Cards */}
      <div className="flex-grow py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-card p-8 md:p-12 rounded-3xl shadow-sm border">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <Sparkles className="h-4 w-4" /> Direct Institutional Consultation
            </div>
            <h2 className="text-2xl font-bold text-foreground">Tell us about your institution and goals</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Our education solutions architects will review your details and reach out within 24 hours.
            </p>
          </div>
          <ContactUsForm />
        </div>
        
        {/* Equal Height Unified Cards */}
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-primary/10 border border-primary/20 text-foreground p-8 rounded-3xl flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-base mb-2">
                <MessageSquare className="h-5 w-5" /> Speak with an Education Advisor
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Need guidance on migrating student data, configuring biometric hardware, or setting up multi-campus roles? Our specialists are here to assist.
              </p>
            </div>
            <p className="text-xs font-semibold text-primary mt-4">
              Direct line: support@schoolpro.com
            </p>
          </div>

          <div className="bg-card border text-foreground p-8 rounded-3xl flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center gap-2 text-foreground font-bold text-base mb-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" /> Enterprise SLA & Compliance
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Inquire about custom FERPA / HIPAA data-isolation agreements, on-premise deployments, or custom SIS/LMS integrations.
              </p>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-4">
              Average response time: &lt; 2 business hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
