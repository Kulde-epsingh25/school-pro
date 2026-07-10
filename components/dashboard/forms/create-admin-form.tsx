"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSchoolStore } from "@/store/schoolStore";
import { Users, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export function CreateAdminForm({ onAdminCreated, roles }: { onAdminCreated: () => void, roles: any[] }) {
  const { school } = useSchoolStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school?.id) {
      setError("No active school context found.");
      return;
    }
    
    if (!formData.roleId) {
      setError("Please select a role.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/users", {
        ...formData,
        tenantId: school.id,
      });

      if (!response.ok) {
        throw new Error(response.error || "Failed to create user");
      }

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        roleId: ""
      });
      onAdminCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">First Name</label>
          <Input 
            required 
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Last Name</label>
          <Input 
            required 
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <Input 
          required 
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <Input 
          placeholder="+1 234 567 890"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Role</label>
        <select 
          required
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.roleId}
          onChange={(e) => setFormData({...formData, roleId: e.target.value})}
        >
          <option value="" disabled>Select a role</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
        Create Admin Account
      </Button>
    </form>
  );
}
