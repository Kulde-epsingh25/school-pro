"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-destructive mb-2">Invalid Link</h2>
          <p className="text-muted-foreground">This verification link is invalid or missing the required token.</p>
        </div>
      </div>
    );
  }

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Setup failed");
      }

      toast.success("Password set successfully!");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2">Set Your Password</h1>
        <p className="text-muted-foreground mb-6">Create a password to activate your account and login.</p>
        
        <form onSubmit={handleSetPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter secure password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Setting up..." : "Set Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
