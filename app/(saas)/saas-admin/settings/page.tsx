"use client";

import { useAuthStore } from "@/store/authStore";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";

interface Setting {
  key: string;
  value: string;
  description?: string;
}

export default function SystemSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: "success" | "error" } | null>(null);

  // Default structure we want to render
  const formStructure = [
    { key: "PLATFORM_NAME", label: "Platform Name", desc: "Global name of the system" },
    { key: "SUPPORT_EMAIL", label: "Support Email", desc: "Contact email for support tickets" },
    { key: "MAINTENANCE_MODE", label: "Maintenance Mode", desc: "Set to 'true' to disable logins" },
    { key: "PAYMENT_GATEWAY", label: "Payment Gateway", desc: "e.g., Stripe, Razorpay" }
  ];

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/system`, { headers: { "Authorization": `Bearer ${token}` } });
        if (res.ok) {
          const data: Setting[] = await res.json();
          
          // Merge API data with form structure
          const merged = formStructure.map(field => {
            const existing = data.find(d => d.key === field.key);
            return {
              key: field.key,
              value: existing ? existing.value : "",
              description: field.desc
            };
          });
          setSettings(merged);
        }
      } catch (error) {
        console.error("Failed to fetch settings", error);
        setMessage({ text: "Failed to load settings.", type: "error" });
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/system`, {
        method: "PUT",
        headers: { "x-user-id": user?.id || "", "Content-Type": "application/json" },
        body: JSON.stringify({ settings })
      });

      if (res.ok) {
        setMessage({ text: "Settings saved successfully!", type: "success" });
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Failed to save settings.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Configuration</h2>
          <p className="text-muted-foreground">
            Manage global platform settings and configurations.
          </p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Global Settings</CardTitle>
          <CardDescription>Changes made here apply to all tenants immediately.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center p-8">
               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
             </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-6">
              {message && (
                <div className={`p-3 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {message.text}
                </div>
              )}

              {settings.map((setting) => (
                <div key={setting.key} className="space-y-2 pb-4 border-b last:border-0">
                  <Label htmlFor={setting.key} className="font-semibold">{formStructure.find(f => f.key === setting.key)?.label || setting.key}</Label>
                  <p className="text-xs text-muted-foreground mb-2">{setting.description}</p>
                  <Input 
                    id={setting.key} 
                    value={setting.value} 
                    onChange={(e) => handleChange(setting.key, e.target.value)} 
                    placeholder="Enter value..."
                  />
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Configuration
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
