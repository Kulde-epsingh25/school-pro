"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaGraduationCap } from "react-icons/fa6";

export default function SchoolOnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [logoBase64, setLogoBase64] = useState("");

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
    if (!schoolName.trim()) {
      toast.error("Please enter a school name");
      return;
    }
    
    try {
      setLoading(true);
      const data = {
        name: schoolName,
        logo: logoBase64 || "https://dummyimage.com/200x200",
      };
      
      const res = await fetch("http://localhost:8000/schools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error("Failed to create school");
      }
      
      toast.success("Successfully Created!");
      setSchoolName("");
      setLogoBase64("");
      
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
            School Name
          </label>
          <Input
            id="schoolName"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="School Name"
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
          className="w-40 bg-[#6366F1] hover:bg-[#4F46E5] text-white flex items-center gap-2"
        >
          {loading ? "Registering..." : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              Register School
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
