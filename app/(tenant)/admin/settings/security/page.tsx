"use client";

import React, { useState, useEffect } from "react";
import { Shield, Users, Mail, Plus, X, Lock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/dashboard/page-header";

export default function SecuritySettingsPage() {
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (school?.id) {
      fetchSharedAccess();
    }
  }, [school?.id]);

  const fetchSharedAccess = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/security/shared-access?tenantId=${school?.id}`, { headers: { "x-user-id": user?.id || "" } });
      if (res.ok) {
        const data = await res.json();
        setSharedWith(data.sharedWith || []);
      }
    } catch (error) {
      console.error("Failed to fetch shared access:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) return;
    if (sharedWith.includes(newEmail)) {
      setNewEmail("");
      return;
    }
    
    setSharedWith([...sharedWith, newEmail]);
    setNewEmail("");
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setSharedWith(sharedWith.filter(email => email !== emailToRemove));
  };

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/security/shared-access?tenantId=${school?.id}`, {
        method: "PUT",
        headers: { "x-user-id": user?.id || "", "Content-Type": "application/json" },
        body: JSON.stringify({ sharedWith })
      });
      
      if (res.ok) {
        alert("Shared access updated successfully");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update shared access");
      }
    } catch (error) {
      console.error("Failed to save shared access:", error);
      alert("Failed to save shared access");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Security Settings"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Super Admin Access
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage who has access to the primary Super Administrator account for this organization.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800 mt-4">
            <strong>Warning:</strong> Anyone listed here has full unrestricted access to all data and settings within this tenant.
          </div>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shared Credentials</CardTitle>
              <CardDescription>Email addresses authorized to use the Super Admin login.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <form onSubmit={handleAddEmail} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="Enter email address..." 
                    className="pl-9"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" disabled={!newEmail}>
                  <Plus className="w-4 h-4 mr-1" /> Add
                </Button>
              </form>

              <div className="border rounded-md divide-y">
                {loading ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                ) : sharedWith.length === 0 ? (
                  <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center">
                    <Users className="w-8 h-8 text-slate-300 mb-2" />
                    No emails are currently sharing this account.
                  </div>
                ) : (
                  sharedWith.map((email, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-medium text-xs">
                          {email[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{email}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                        onClick={() => handleRemoveEmail(email)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 pt-4 flex justify-between">
              <span className="text-xs text-muted-foreground">
                Changes require explicit saving to take effect.
              </span>
              <Button onClick={handleSave} disabled={isSubmitting || loading}>
                {isSubmitting ? "Saving..." : "Save Configuration"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
