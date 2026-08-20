"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactUsForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    schoolName: "",
    country: "",
    schoolWebsite: "",
    students: "",
    role: "",
    media: "",
    painPoints: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const saveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.schoolName || !formData.country) {
      toast.error("Please fill required fields (Full Name, Work Email, School Name, Country)");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          students: formData.students ? parseInt(formData.students, 10) : null,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit contact");
      }

      toast.success("Thank you! Your request has been successfully submitted.", {
        description: "Our school transformation team will contact you within 24 hours."
      });
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        schoolName: "",
        country: "",
        schoolWebsite: "",
        students: "",
        role: "",
        media: "",
        painPoints: "",
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={saveContact} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info (FullName, Email, Phone) */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Full Name <span className="text-destructive">*</span>
          </label>
          <Input 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange} 
            placeholder="Dr. Sarah Jenkins" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Work / Official Email <span className="text-destructive">*</span>
          </label>
          <Input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="principal@oakridge-academy.edu" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Phone Number</label>
          <Input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="+1 (555) 234-5678" 
          />
        </div>

        {/* Institution Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            School / Institution Name <span className="text-destructive">*</span>
          </label>
          <Input 
            name="schoolName" 
            value={formData.schoolName} 
            onChange={handleChange} 
            placeholder="Oakridge International Academy" 
            required 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Country <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <select 
              name="country" 
              value={formData.country} 
              onChange={handleChange} 
              className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary" 
              required
            >
              <option value="">Select Country...</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="India">India</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="South Africa">South Africa</option>
              <option value="Uganda">Uganda</option>
              <option value="Ghana">Ghana</option>
              <option value="UAE">United Arab Emirates</option>
              <option value="Singapore">Singapore</option>
              <option value="Other">Other International</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">School Website or Social Profile</label>
          <Input 
            name="schoolWebsite" 
            value={formData.schoolWebsite} 
            onChange={handleChange} 
            placeholder="https://www.oakridge-academy.edu" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Estimated Student Enrollment</label>
          <Input 
            type="number" 
            name="students" 
            value={formData.students} 
            onChange={handleChange} 
            placeholder="e.g. 500" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Your Role in Institution <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange} 
              className="w-full h-10 px-3 py-2 text-sm border rounded-md bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary" 
              required
            >
              <option value="">Select Role...</option>
              <option value="Principal / Head of School">Principal / Head of School</option>
              <option value="Board Member / Trustee">Board Member / Trustee</option>
              <option value="IT Director / System Admin">IT Director / System Admin</option>
              <option value="Academic Dean / Department Head">Academic Dean / Department Head</option>
              <option value="Bursar / Finance Director">Bursar / Finance Director</option>
              <option value="Teacher / Faculty">Teacher / Faculty</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          What key challenges or administrative pain points would you like School Pro to solve?
        </label>
        <textarea
          name="painPoints"
          value={formData.painPoints}
          onChange={handleChange}
          rows={3}
          className="w-full border rounded-md p-3 bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none text-sm"
          placeholder="e.g., Automating biometric student attendance, parent billing reminders, and real-time report card generation..."
          required
        ></textarea>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base font-semibold">
        {loading ? "Submitting Request..." : (
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            Schedule Personalized Demo
          </span>
        )}
      </Button>
    </form>
  );
}
