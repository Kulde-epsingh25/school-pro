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
    if (!formData.schoolName || !formData.country) {
      toast.error("Please fill required fields (School Name, Country)");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://school-pro-api-6mxq.onrender.com/contacts", {
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

      toast.success("Your Request has been Successfully Submitted!");
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
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={saveContact} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">School Name</label>
          <Input name="schoolName" value={formData.schoolName} onChange={handleChange} placeholder="Alan Shields" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Country</label>
          <div className="relative">
            <select name="country" value={formData.country} onChange={handleChange} className="w-full h-10 px-3 py-2 text-sm border rounded-md appearance-none" required>
              <option value="">Select Country...</option>
              <option value="Uganda">Uganda</option>
              <option value="Kenya">Kenya</option>
              <option value="Nigeria">Nigeria</option>
              <option value="India">India</option>
              <option value="USA">USA</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">School Website/Social Media Page(fb,linkedin)</label>
          <Input name="schoolWebsite" value={formData.schoolWebsite} onChange={handleChange} placeholder="https://www.qilytijulaqe.mobi" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Number of Students</label>
          <Input type="number" name="students" value={formData.students} onChange={handleChange} placeholder="386" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Role</label>
          <div className="relative">
            <select name="role" value={formData.role} onChange={handleChange} className="w-full h-10 px-3 py-2 text-sm border rounded-md appearance-none" required>
              <option value="">Select Role...</option>
              <option value="Principal/Leadership/Mgt">Principal/Leadership/Mgt</option>
              <option value="Teacher">Teacher</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Which Media did hear about Us</label>
          <div className="relative">
            <select name="media" value={formData.media} onChange={handleChange} className="w-full h-10 px-3 py-2 text-sm border rounded-md appearance-none">
              <option value="">Select...</option>
              <option value="Blog">Blog</option>
              <option value="Social Media">Social Media</option>
              <option value="Friend">Friend</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Please share with us the key pain points you want to solve</label>
        <textarea
          name="painPoints"
          value={formData.painPoints}
          onChange={handleChange}
          className="w-full border rounded-md p-3 min-h-[100px]"
          required
        ></textarea>
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white py-3">
        {loading ? "Submitting..." : (
          <span className="flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            Submit
          </span>
        )}
      </Button>
    </form>
  );
}
