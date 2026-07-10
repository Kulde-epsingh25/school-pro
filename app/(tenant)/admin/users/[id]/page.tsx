"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSchoolStore } from "@/store/schoolStore";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const school = useSchoolStore(state => state.school);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      if (!school?.id) return;

      const res = await apiClient.get<any>(`/users/${userId}`);
      if (res.ok && res.data) {
        setFormData({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          phone: res.data.phone || ""
        });
      } else {
        toast.error("Failed to load user");
      }
      setLoading(false);
    }

    fetchUser();
  }, [school?.id, userId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const res = await apiClient.put(`/users/${userId}`, formData);
    
    if (res.ok) {
      toast.success("User updated successfully");
      router.push("/admin/users");
    } else {
      toast.error(res.error || "Failed to update user");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading user details...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-border">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit User</h1>
        <p className="text-muted-foreground">Update user profile information.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              placeholder="First Name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              placeholder="Last Name"
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            placeholder="Phone (Optional)"
          />
        </div>
        
        <div className="flex gap-4 pt-4 border-t border-border">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
