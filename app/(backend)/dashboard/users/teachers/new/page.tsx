"use client";

import React, { useState } from "react";
import { ChevronLeft, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewTeacherPage() {
  const [formData, setFormData] = useState({
    title: "Mr",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    whatsappNo: "",
    nationality: "Uganda",
    nationalId: "",
    gender: "MALE",
    dob: "",
    preferredContact: "Phone",
    password: "",
    doj: "",
    designation: "",
    department: "Science",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
      <div className="bg-white rounded-xl border shadow-sm p-6 overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-6 border-b mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900" onClick={() => window.history.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Create Teacher</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="text-gray-600 border-gray-300">
              Close
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Save Teacher
            </Button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
          {/* Row 1 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Title</label>
            <select name="title" value={formData.title} onChange={handleChange} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600 appearance-none">
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">First Name</label>
            <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="h-11 placeholder:text-gray-300" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Last Name</label>
            <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="h-11 placeholder:text-gray-300" />
          </div>

          {/* Row 2 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Phone</label>
            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="h-11 placeholder:text-gray-300" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="h-11 placeholder:text-gray-300" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Whatsap No.</label>
            <Input name="whatsappNo" value={formData.whatsappNo} onChange={handleChange} placeholder="Whatsap No." className="h-11 placeholder:text-gray-300" />
          </div>

          {/* Row 3 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Nationality</label>
            <select name="nationality" value={formData.nationality} onChange={handleChange} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600 appearance-none">
              <option value="Uganda">Uganda</option>
              <option value="Kenya">Kenya</option>
              <option value="Rwanda">Rwanda</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">National ID / Passport No</label>
            <Input name="nationalId" value={formData.nationalId} onChange={handleChange} placeholder="National ID / Passport No" className="h-11 placeholder:text-gray-300" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600 appearance-none">
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
            </select>
          </div>

          {/* Row 4 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Date of Birth</label>
            <div className="relative">
              <Input type="date" name="dob" value={formData.dob} onChange={handleChange} className="h-11 text-gray-600 pr-10" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Preferred Contact Method</label>
            <select name="preferredContact" value={formData.preferredContact} onChange={handleChange} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600 appearance-none">
              <option value="Phone">Phone</option>
              <option value="Email">Email</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Teacher Portal Password</label>
            <div className="relative">
              <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Teacher Portal Password" className="h-11 placeholder:text-gray-300 pr-10" />
              <Eye className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" />
            </div>
          </div>

          {/* Row 5 */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Date of Joining</label>
            <div className="relative">
              <Input type="date" name="doj" value={formData.doj} onChange={handleChange} className="h-11 text-gray-600 pr-10" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Designation</label>
            <Input name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g Head of Department" className="h-11 placeholder:text-gray-300" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Select Department</label>
            <select name="department" value={formData.department} onChange={handleChange} className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-gray-600 appearance-none">
              <option value="Science">Science</option>
              <option value="Arts">Arts</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Languages">Languages</option>
            </select>
          </div>
          
        </div>
      </div>
    </div>
  );
}
