"use client";

import React, { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation";

export default function SchoolAdminOnboardingPage() {
  const params = useParams();
  const schoolId = params.schoolId;

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating admin:", formData);
    // Submit logic here
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50 p-4">
      
      {/* Container Card */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
        
        {/* Top Blue Border */}
        <div className="h-1.5 w-full bg-[#4438CA]"></div>

        <div className="p-10 md:p-14">
          
          {/* Header Section */}
          <div className="text-center mb-10 relative">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Welcome to <span className="text-[#4438CA]">Parish High School,</span>
            </h1>
            <p className="text-gray-600 font-medium text-lg">
              Create the Admin for this School
            </p>

            {/* Floating Logo/Icon (Absolute positioned to the right of subtitle) */}
            <div className="absolute right-4 top-10 md:right-16 md:top-8 hidden md:flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
               <span className="text-white font-bold text-xl">+</span>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Admin Name */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Admin Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Admin Name" 
                    className="pl-10 h-12 rounded-lg border-gray-200 focus:border-[#4438CA] focus:ring-[#4438CA] transition-all bg-gray-50/30"
                    required
                  />
                </div>
              </div>

              {/* Admin Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Admin Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Admin Email" 
                    className="pl-10 h-12 rounded-lg border-gray-200 focus:border-[#4438CA] focus:ring-[#4438CA] transition-all bg-gray-50/30"
                    required
                  />
                </div>
              </div>

              {/* Admin Phone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Admin Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Admin Phone" 
                    className="pl-10 h-12 rounded-lg border-gray-200 focus:border-[#4438CA] focus:ring-[#4438CA] transition-all bg-gray-50/30"
                    required
                  />
                </div>
              </div>

              {/* Admin Password */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-800">Admin Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Admin Password" 
                    className="pl-10 pr-10 h-12 rounded-lg border-gray-200 focus:border-[#4438CA] focus:ring-[#4438CA] transition-all bg-gray-50/30"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button type="submit" className="h-12 px-8 bg-[#4438CA] hover:bg-[#3730A3] text-white font-medium rounded-lg transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                Create School Admin
              </Button>
            </div>
          </form>

        </div>
      </div>

    </div>
  );
}
