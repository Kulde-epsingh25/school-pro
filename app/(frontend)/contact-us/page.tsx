import React from "react";
import ContactUsForm from "@/components/frontend/forms/contact-us-form";
import Logo from "@/components/frontend/logo";

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-white text-black py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Logo />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">Get Your School Management System</h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Ready to transform your school's digital infrastructure? Fill out the form below and we'll help you get started with a customized solution tailored to your institution's needs.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 flex-grow py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Tell us about your institution and requirements</h2>
            <p className="text-gray-500">Our team will reach out within 24 hours to schedule a personalized demo and discuss your specific needs.</p>
          </div>
          <ContactUsForm />
        </div>
        
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#115E59] text-white p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Speak to someone in sales</h3>
            <p className="text-sm opacity-90">To create a more value-added solution, is essential to an analysis of the possibilities of improvement.</p>
          </div>
          <div className="bg-[#A3E635] text-black p-8 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Contact to our team</h3>
            <p className="text-sm opacity-90">To create a more value-added solution, is essential to an analysis of the possibilities of improvement.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
