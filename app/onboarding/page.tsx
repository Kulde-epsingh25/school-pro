"use client";

import React, { useState } from "react";
import { ArrowRight, Building2, User, CheckCircle2, ChevronRight, School, Globe, Mail, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    domain: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    logoBase64: ""
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Image size should be less than 1MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, logoBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://school-pro-api-6mxq-5qzq.onrender.com/tenants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStep(4); // Success step
      } else {
        const data = await res.json().catch(() => null);
        const errorMsg = data?.error || "Failed to onboard.";
        const errorDetails = data?.details ? `\nDetails: ${data.details}` : "";
        alert(errorMsg + errorDetails + "\n\nPlease try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-emerald-100 opacity-50 blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl z-10">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-[#2563EB] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
            <School className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Setup your Institution</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">Join thousands of schools modernizing their operations.</p>
        </div>

        <div className="bg-white py-8 px-4 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {/* Progress Indicator */}
          {step < 4 && (
            <div className="mb-8">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                
                <div className={`relative z-10 flex flex-col items-center gap-2 ${step >= 1 ? 'text-[#2563EB]' : 'text-gray-300'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm transition-colors duration-300 ${step >= 1 ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                  <span className="text-xs font-bold uppercase tracking-wider">Institution</span>
                </div>
                
                <div className={`relative z-10 flex flex-col items-center gap-2 ${step >= 2 ? 'text-[#2563EB]' : 'text-gray-300'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm transition-colors duration-300 ${step >= 2 ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
                  <span className="text-xs font-bold uppercase tracking-wider">Super Admin</span>
                </div>
                
                <div className={`relative z-10 flex flex-col items-center gap-2 ${step >= 3 ? 'text-[#2563EB]' : 'text-gray-300'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 border-white shadow-sm transition-colors duration-300 ${step >= 3 ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
                  <span className="text-xs font-bold uppercase tracking-wider">Review</span>
                </div>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-6">
            
            {/* Step 1: School Info */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Official Institution Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleChange}
                      placeholder="e.g. Oxford University" 
                      className="pl-10 h-12 bg-gray-50/50 border-gray-200 font-medium text-gray-900" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Official Domain (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Globe className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      name="domain"
                      value={formData.domain}
                      onChange={handleChange}
                      placeholder="e.g. oxford.edu" 
                      className="pl-10 h-12 bg-gray-50/50 border-gray-200 font-medium text-gray-900" 
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 font-medium">This domain will be strictly enforced for all multi-tenant logins.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Institution Logo</label>
                  <div className="flex items-center gap-4">
                    {formData.logoBase64 ? (
                      <img src={formData.logoBase64} alt="Logo" className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200" />
                    ) : (
                      <div className="bg-gray-100 p-2 rounded-full flex items-center justify-center w-12 h-12 border border-gray-200">
                        <School className="text-gray-400 text-xl" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        id="logoUpload"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="logoUpload">
                        <Button type="button" variant="outline" className="h-10 border-gray-200 text-gray-700 cursor-pointer w-full text-sm font-semibold hover:bg-gray-50" onClick={() => document.getElementById('logoUpload')?.click()}>
                          Upload Logo (Max 1MB)
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Admin Info */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input 
                        name="adminFirstName"
                        value={formData.adminFirstName}
                        onChange={handleChange}
                        placeholder="John" 
                        className="pl-10 h-12 bg-gray-50/50 border-gray-200 font-medium text-gray-900" 
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                    <Input 
                      name="adminLastName"
                      value={formData.adminLastName}
                      onChange={handleChange}
                      placeholder="Doe" 
                      className="h-12 bg-gray-50/50 border-gray-200 font-medium text-gray-900" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Super Admin Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      name="adminEmail"
                      type="email"
                      value={formData.adminEmail}
                      onChange={handleChange}
                      placeholder="admin@institution.edu" 
                      className="pl-10 h-12 bg-gray-50/50 border-gray-200 font-medium text-gray-900" 
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 font-medium">We will send an automated invitation link to this email to verify the account.</p>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                  <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Verify Provisioning Details
                  </h4>
                  
                  <dl className="space-y-3 text-sm">
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-500 font-semibold">Institution:</dt>
                      <dd className="col-span-2 text-gray-900 font-bold">{formData.schoolName}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-500 font-semibold">Domain:</dt>
                      <dd className="col-span-2 text-gray-900 font-bold">{formData.domain || "N/A"}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-500 font-semibold">Super Admin:</dt>
                      <dd className="col-span-2 text-gray-900 font-bold">{formData.adminFirstName} {formData.adminLastName}</dd>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <dt className="text-gray-500 font-semibold">Admin Email:</dt>
                      <dd className="col-span-2 text-blue-600 font-bold">{formData.adminEmail}</dd>
                    </div>
                  </dl>
                </div>
                
                <p className="mt-4 text-xs text-gray-500 text-center font-medium leading-relaxed">
                  By clicking provision, we will instantly generate your isolated Master Tenant and dispatch the verification email.
                </p>
              </div>
            )}

            {/* Step 4: Success State */}
            {step === 4 && (
              <div className="text-center animate-in zoom-in-95 duration-500 py-6">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Provisioning Successful!</h3>
                <p className="mt-3 text-gray-500 font-medium">
                  We've successfully created the Master Tenant for <span className="text-gray-900 font-bold">{formData.schoolName}</span>.
                </p>
                <div className="mt-6 bg-gray-50 border border-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-semibold">
                    An automated invitation has been dispatched to:<br/>
                    <span className="text-blue-600 font-bold">{formData.adminEmail}</span>
                  </p>
                </div>
                <p className="mt-4 text-xs text-gray-400 italic font-medium">
                  (Developer Note: Check your terminal console for the simulated Magic Link!)
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="pt-4 flex gap-4">
                {step > 1 && (
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                    onClick={handlePrev}
                  >
                    Back
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button 
                    className="flex-1 h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-bold shadow-sm"
                    onClick={handleNext}
                  >
                    Continue
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                ) : (
                  <Button 
                    className="flex-1 h-12 bg-gray-900 hover:bg-black text-white font-bold shadow-md"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Provisioning..." : "Provision System"}
                    {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
