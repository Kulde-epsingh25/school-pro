import React from "react";
import SchoolOnboardingForm from "@/components/forms/school/school-onboarding-form";

export default function SchoolOnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 pt-16">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl border border-[#6366F1] shadow-lg shadow-[#6366F1]/10">
        <SchoolOnboardingForm />
      </div>
    </div>
  );
}