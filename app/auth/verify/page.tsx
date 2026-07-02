"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    if (!token) {
      setStatus("error");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://school-pro-api-6mxq.onrender.com/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          router.push("/dashboard/admin/contacts"); // Route to a generic dashboard for now
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "error") {
    return (
      <div className="text-center animate-in zoom-in-95 duration-500 py-6">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
          <AlertCircle className="h-10 w-10 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Invalid Verification Link</h3>
        <p className="mt-3 text-gray-500 font-medium">
          The link you clicked is invalid or has expired. Please contact your system administrator.
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center animate-in zoom-in-95 duration-500 py-6">
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Account Verified!</h3>
        <p className="mt-3 text-gray-500 font-medium">
          Your password has been set. Routing you to your dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Secure Your Account</h2>
        <p className="mt-2 text-sm text-gray-500 font-medium">Set a strong password to activate your administrative access.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="pl-10 h-12 bg-gray-50/50 border-gray-200 font-medium text-gray-900" 
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <Input 
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••" 
              className="pl-10 h-12 bg-gray-50/50 border-gray-200 font-medium text-gray-900" 
            />
          </div>
        </div>

        <Button 
          type="submit"
          className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-bold shadow-sm mt-4"
          disabled={loading}
        >
          {loading ? "Activating..." : "Activate Account"}
        </Button>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 -ml-32 -mt-32 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-white py-10 px-6 shadow-2xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          <Suspense fallback={<p className="text-center text-gray-500">Loading...</p>}>
            <VerifyContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
