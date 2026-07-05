"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGraduationCap } from "react-icons/fa6";
import { useRouter } from "next/navigation";

export default function SchoolOnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [adminFirstName, setAdminFirstName] = useState("");
  const [adminLastName, setAdminLastName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [logoBase64, setLogoBase64] = useState("");
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image size should be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim() || !adminFirstName.trim() || !adminLastName.trim() || !adminEmail.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setLoading(true);
      const data = {
        name: schoolName,
        domain: schoolName.toLowerCase().replace(/[^a-z0-9]/g, ""),
        adminFirstName,
        adminLastName,
        adminEmail,
        plan: "starter", // Default plan
      };
      
      const res = await fetch("https://school-pro-api-6mxq-5qzq.onrender.com/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error("Failed to register school");
      }
      
      toast.success("Successfully Registered! Please login.");
      router.push("/login");
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome to School Pro,</h1>
        <p className="text-gray-500">
          Complete your school's profile to get started with SchoolPro.
        </p>
      </div>

      <form onSubmit={saveSchool} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="schoolName" className="text-sm font-medium">
            Organization Name
          </label>
          <Input
            id="schoolName"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="e.g. Global Academy"
            className="w-full border-gray-300 focus:border-[#6366F1] focus:ring-[#6366F1]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="adminFirstName" className="text-sm font-medium">
              Admin First Name
            </label>
            <Input
              id="adminFirstName"
              value={adminFirstName}
              onChange={(e) => setAdminFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full border-gray-300 focus:border-[#6366F1] focus:ring-[#6366F1]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="adminLastName" className="text-sm font-medium">
              Admin Last Name
            </label>
            <Input
              id="adminLastName"
              value={adminLastName}
              onChange={(e) => setAdminLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full border-gray-300 focus:border-[#6366F1] focus:ring-[#6366F1]"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="adminEmail" className="text-sm font-medium">
            Admin Email Address
          </label>
          <Input
            id="adminEmail"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            placeholder="admin@school.com"
            className="w-full border-gray-300 focus:border-[#6366F1] focus:ring-[#6366F1]"
          />
        </div>

        <div className="border rounded-xl p-6 flex flex-col items-center text-center space-y-4">
          <h3 className="font-semibold text-lg">Customise your School Logo</h3>
          
          <div className="flex items-center gap-2">
            {logoBase64 ? (
              <img src={logoBase64} alt="Logo" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="bg-[#1D4ED8] p-2 rounded-full flex items-center justify-center w-12 h-12">
                <FaGraduationCap className="text-white text-xl" />
              </div>
            )}
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              School <span className="text-[#3B82F6]">Pro</span>
            </span>
          </div>

          <div className="mt-4">
            <Input
              type="file"
              id="logoUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <label htmlFor="logoUpload">
              <Button type="button" variant="default" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white cursor-pointer" onClick={() => document.getElementById('logoUpload')?.click()}>
                <span>Choose File</span>
              </Button>
            </label>
            <p className="text-xs text-gray-500 mt-2">Image (1MB)</p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center justify-center gap-2 py-6 text-lg"
        >
          {loading ? "Registering..." : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              Register School & Create Admin
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
