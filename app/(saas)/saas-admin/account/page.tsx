"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Key, Users, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

interface AccountDetails {
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  sharedWith: string[];
}

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

  // Share state
  const [shareEmail, setShareEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);

  const fetchAccount = async () => {
    try {
      const res = await apiClient.get<AccountDetails>("/saas/account");
      if (res.ok && res.data) setAccount(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(true);
    setPasswordMsg({ text: "", type: "" });
    try {
      const res = await apiClient.put("/saas/account/password", { currentPassword, newPassword });
      
      if (res.ok) {
        setPasswordMsg({ text: "Password updated successfully.", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
      } else {
        setPasswordMsg({ text: res.error || "Failed to update password.", type: "error" });
      }
    } catch (err) {
      setPasswordMsg({ text: "An error occurred.", type: "error" });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shareEmail) return;
    setIsSharing(true);
    try {
      const res = await apiClient.post("/saas/account/share", { email: shareEmail });
      if (res.ok) {
        setShareEmail("");
        fetchAccount();
      } else {
        alert(res.error || "Failed to share account");
      }
    } catch (err) {
      alert("Error sharing account");
    } finally {
      setIsSharing(false);
    }
  };

  const handleRevoke = async (email: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${email}?`)) return;
    try {
      const res = await apiClient.delete(`/saas/account/share/${encodeURIComponent(email)}`);
      if (res.ok) {
        fetchAccount();
      } else {
        alert(res.error || "Failed to revoke access.");
      }
    } catch (err) {
      alert("Error revoking access.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin h-8 w-8 text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Account & Security</h2>
        <p className="text-muted-foreground">
          Manage your master SaaS Super Admin account credentials and shared access.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5" /> Change Password</CardTitle>
            <CardDescription>Update the master password for the SaaS platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  required 
                  minLength={8}
                />
              </div>
              {passwordMsg.text && (
                <p className={`text-sm ${passwordMsg.type === "error" ? "text-red-500" : "text-green-500"}`}>
                  {passwordMsg.text}
                </p>
              )}
              <Button type="submit" disabled={isUpdatingPassword}>
                {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> Shared Credentials</CardTitle>
            <CardDescription>Invite other team members to share this master account. They will receive the password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleShare} className="flex gap-2">
              <Input 
                placeholder="colleague@company.com" 
                type="email" 
                value={shareEmail} 
                onChange={(e) => setShareEmail(e.target.value)} 
                required 
              />
              <Button type="submit" disabled={isSharing}>
                {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Share"}
              </Button>
            </form>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Currently Shared With:</h4>
              {account?.sharedWith.length === 0 ? (
                <p className="text-sm text-muted-foreground">Not shared with anyone.</p>
              ) : (
                <ul className="space-y-2">
                  {account?.sharedWith.map((email) => (
                    <li key={email} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-sm">{email}</span>
                      <Button variant="ghost" size="icon" onClick={() => handleRevoke(email)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
