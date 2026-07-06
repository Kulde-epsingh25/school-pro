"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewTenantPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    adminFirstName: "",
    adminLastName: "",
    adminEmail: "",
    plan: "starter"
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handlePlanChange = (value: string | null) => {
    if (value) {
       setFormData({ ...formData, plan: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/tenants`, {
        method: "POST",
        headers: { "x-user-id": user?.id || "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create tenant");
      }

      router.push("/saas-admin/tenants");
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the tenant.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Register New Tenant</CardTitle>
          <CardDescription>
            {step === 1 && "Step 1: Organization Details"}
            {step === 2 && "Step 2: Admin Account Setup"}
            {step === 3 && "Step 3: Subscription & Configuration"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} placeholder="e.g. Sunrise Academy" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Platform Domain</Label>
                  <div className="flex items-center space-x-2">
                     <Input id="domain" value={formData.domain} onChange={handleChange} placeholder="sunrise" required className="flex-1" />
                     <span className="text-muted-foreground">.schoolpro.com</span>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminFirstName">Admin First Name</Label>
                    <Input id="adminFirstName" value={formData.adminFirstName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="adminLastName">Admin Last Name</Label>
                    <Input id="adminLastName" value={formData.adminLastName} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input id="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} required />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
                <div className="space-y-2">
                  <Label htmlFor="plan">Subscription Plan</Label>
                  <Select value={formData.plan} onValueChange={handlePlanChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter Plan ($99/mo)</SelectItem>
                      <SelectItem value="pro">Professional Plan ($299/mo)</SelectItem>
                      <SelectItem value="enterprise">Enterprise Plan (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
               <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1 || loading}>
                  Back
               </Button>
               {step < 3 ? (
                  <Button type="submit">Next Step</Button>
               ) : (
                  <Button type="submit" disabled={loading}>
                     {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Registration"}
                  </Button>
               )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
