"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, ShieldAlert, Edit2, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSchoolStore } from "@/store/schoolStore";
import { PageHeader } from "@/components/dashboard/page-header";

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    description: "",
    color: "#3b82f6",
    selectedPermissions: [] as string[]
  });

  const school = useSchoolStore((state) => state.school);

  useEffect(() => {
    if (school?.id) {
      fetchRoles();
      fetchPermissions();
    }
  }, [school?.id]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/roles?tenantId=${school?.id}`);
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch(`http://localhost:8000/roles/permissions?tenantId=${school?.id}`);
      if (res.ok) {
        const data = await res.json();
        setPermissions(data);
      }
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://localhost:8000/roles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tenantId: school?.id,
          name: formData.name,
          displayName: formData.displayName,
          description: formData.description,
          color: formData.color,
          permissionIds: formData.selectedPermissions
        })
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        setFormData({ name: "", displayName: "", description: "", color: "#3b82f6", selectedPermissions: [] });
        fetchRoles(); // Refresh the list
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create role");
      }
    } catch (error) {
      console.error("Error creating role", error);
      alert("Error creating role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePermission = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(id) 
        ? prev.selectedPermissions.filter(pId => pId !== id)
        : [...prev.selectedPermissions, id]
    }));
  };

  // Group permissions by subject
  const groupedPermissions = permissions.reduce((acc: any, p: any) => {
    if (!acc[p.subject]) acc[p.subject] = [];
    acc[p.subject].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        count={roles.length}
        addLabel="Create Role"
        onAdd={() => setIsCreateModalOpen(true)}
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Organization Roles</CardTitle>
              <CardDescription>View and manage access levels for your staff.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search roles..."
                  className="pl-8 w-[250px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading roles...</div>
          ) : roles.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No roles found. Create a new role to get started.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roles.map((role) => (
                <Card key={role.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`h-2 w-full`} style={{ backgroundColor: role.color || '#e2e8f0' }} />
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{role.displayName}</CardTitle>
                        <p className="text-xs text-muted-foreground font-mono mt-1">{role.name}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10">
                        {role._count?.userRoles || 0} Users
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                      {role.description || "No description provided."}
                    </p>
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <span className="text-xs font-medium text-muted-foreground">
                        {role.permissions?.length || 0} Permissions
                      </span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role and configure its specific permissions within the organization.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateRole} className="space-y-6 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name <span className="text-red-500">*</span></label>
                <Input 
                  placeholder="e.g. Senior Teacher" 
                  required 
                  value={formData.displayName}
                  onChange={e => setFormData({...formData, displayName: e.target.value, name: e.target.value.toUpperCase().replace(/\s+/g, '_')})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">System Name</label>
                <Input 
                  placeholder="e.g. SENIOR_TEACHER" 
                  required 
                  disabled
                  value={formData.name}
                  className="bg-muted font-mono text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Briefly describe the responsibilities of this role..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role Color Badge</label>
              <div className="flex items-center gap-4">
                <Input 
                  type="color" 
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  className="h-10 w-20 p-1 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">Select a color to help identify this role.</span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div>
                <h4 className="font-semibold mb-1">Permissions <span className="text-red-500">*</span></h4>
                <p className="text-sm text-muted-foreground">Select the specific actions this role can perform.</p>
              </div>

              {Object.keys(groupedPermissions).length === 0 ? (
                <div className="text-sm text-amber-600 bg-amber-50 p-4 rounded-md border border-amber-200">
                  No permissions have been seeded for this organization yet. Please contact support.
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedPermissions).map(([subject, perms]: [string, any]) => (
                    <div key={subject} className="bg-slate-50 p-4 rounded-lg border">
                      <h5 className="font-semibold text-sm capitalize mb-3 text-slate-800 border-b pb-2">
                        {subject.toLowerCase()} Management
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {perms.map((p: any) => {
                          const isSelected = formData.selectedPermissions.includes(p.id);
                          return (
                            <label 
                              key={p.id} 
                              className={`flex items-start gap-2 p-2 rounded cursor-pointer transition-colors border ${
                                isSelected ? 'bg-primary/5 border-primary/20' : 'hover:bg-slate-100 border-transparent'
                              }`}
                            >
                              <div className="mt-0.5">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                                  checked={isSelected}
                                  onChange={() => togglePermission(p.id)}
                                />
                              </div>
                              <div className="flex flex-col">
                                <span className={`text-xs font-medium ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                                  {p.action}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || formData.selectedPermissions.length === 0}>
                {isSubmitting ? "Creating..." : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
