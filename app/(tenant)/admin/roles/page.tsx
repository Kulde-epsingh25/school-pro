"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, ShieldAlert, Edit2, Trash2, CheckCircle2, ShieldCheck } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { PageHeader } from "@/components/dashboard/page-header";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export interface PermissionItem {
  id: string;
  subject: string;
  action: string;
  scope: string;
}

export interface TenantRole {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  color?: string;
  tenantId?: string;
  permissions?: { permissionId: string }[];
  _count?: { userRoles: number };
}

const SYSTEM_PERMISSIONS_CATALOG: PermissionItem[] = [
  // User & RBAC Management
  { id: "perm-users-create", subject: "USERS", action: "CREATE", scope: "ALL" },
  { id: "perm-users-read", subject: "USERS", action: "READ", scope: "ALL" },
  { id: "perm-users-update", subject: "USERS", action: "UPDATE", scope: "ALL" },
  { id: "perm-users-delete", subject: "USERS", action: "DELETE", scope: "ALL" },
  { id: "perm-roles-manage", subject: "ROLES", action: "MANAGE", scope: "ALL" },

  // Students & Admissions
  { id: "perm-students-create", subject: "STUDENTS", action: "CREATE", scope: "ALL" },
  { id: "perm-students-read", subject: "STUDENTS", action: "READ", scope: "ALL" },
  { id: "perm-students-update", subject: "STUDENTS", action: "UPDATE", scope: "ALL" },
  { id: "perm-students-delete", subject: "STUDENTS", action: "DELETE", scope: "ALL" },
  { id: "perm-admissions-manage", subject: "ADMISSIONS", action: "MANAGE", scope: "ALL" },

  // Academics, Classes & Exams
  { id: "perm-classes-manage", subject: "CLASSES", action: "MANAGE", scope: "ALL" },
  { id: "perm-timetable-manage", subject: "TIMETABLE", action: "MANAGE", scope: "ALL" },
  { id: "perm-exams-grade", subject: "EXAMINATIONS", action: "GRADE", scope: "ALL" },
  { id: "perm-reportcards-generate", subject: "REPORT_CARDS", action: "GENERATE", scope: "ALL" },

  // Finance & Accounting
  { id: "perm-fees-manage", subject: "FEES", action: "MANAGE", scope: "ALL" },
  { id: "perm-fees-collect", subject: "FEES", action: "COLLECT", scope: "ALL" },
  { id: "perm-expenses-manage", subject: "EXPENSES", action: "MANAGE", scope: "ALL" },

  // Campus Operations
  { id: "perm-transport-manage", subject: "TRANSPORT", action: "MANAGE", scope: "ALL" },
  { id: "perm-hostel-manage", subject: "HOSTEL", action: "MANAGE", scope: "ALL" },
  { id: "perm-library-manage", subject: "LIBRARY", action: "MANAGE", scope: "ALL" },
];

const INITIAL_TENANT_ROLES: TenantRole[] = [
  {
    id: "role-admin",
    name: "ADMIN",
    displayName: "School Administrator",
    description: "Full administrative and operational authority for the school campus.",
    color: "#2563EB",
    permissions: SYSTEM_PERMISSIONS_CATALOG.map(p => ({ permissionId: p.id })),
    _count: { userRoles: 1 }
  },
  {
    id: "role-academic-coord",
    name: "ACADEMIC_COORDINATOR",
    displayName: "Academic Coordinator",
    description: "Manages curriculum standards, terms, timetable allocations, and teachers.",
    color: "#7C3AED",
    permissions: [
      { permissionId: "perm-classes-manage" },
      { permissionId: "perm-timetable-manage" },
      { permissionId: "perm-exams-grade" },
      { permissionId: "perm-reportcards-generate" },
    ],
    _count: { userRoles: 0 }
  },
  {
    id: "role-teacher",
    name: "TEACHER",
    displayName: "Faculty Teacher",
    description: "Daily attendance marking, gradebook evaluation, and student assignments.",
    color: "#059669",
    permissions: [
      { permissionId: "perm-students-read" },
      { permissionId: "perm-exams-grade" },
    ],
    _count: { userRoles: 0 }
  },
  {
    id: "role-bursar",
    name: "BURSAR",
    displayName: "Finance Officer / Bursar",
    description: "Student tuition ledger, invoicing, collection, and bank reconciliations.",
    color: "#D97706",
    permissions: [
      { permissionId: "perm-fees-manage" },
      { permissionId: "perm-fees-collect" },
      { permissionId: "perm-expenses-manage" },
    ],
    _count: { userRoles: 0 }
  },
  {
    id: "role-admissions",
    name: "ADMISSIONS_OFFICER",
    displayName: "Admissions Officer",
    description: "Student enrollments, guardian registration, and document verification.",
    color: "#0891B2",
    permissions: [
      { permissionId: "perm-students-create" },
      { permissionId: "perm-students-read" },
      { permissionId: "perm-students-update" },
      { permissionId: "perm-admissions-manage" },
    ],
    _count: { userRoles: 0 }
  }
];

export default function RolesPage() {
  const [roles, setRoles] = useState<TenantRole[]>(INITIAL_TENANT_ROLES);
  const [permissions, setPermissions] = useState<PermissionItem[]>(SYSTEM_PERMISSIONS_CATALOG);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    displayName: "",
    description: "",
    color: "#2563eb",
    selectedPermissions: [] as string[]
  });

  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchRoles();
  }, [school?.id]);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<TenantRole[]>(`/roles?tenantId=${school?.id || user?.schoolId || ''}`);
      if (res.ok && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const merged = [...INITIAL_TENANT_ROLES];
        res.data.forEach(r => {
          if (!merged.some(m => m.id === r.id || m.name === r.name)) {
            merged.push(r);
          }
        });
        setRoles(merged);
      }
    } catch (error) {
      console.warn("Could not fetch remote roles, using defaults:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName.trim()) return;

    setIsSubmitting(true);
    try {
      const generatedName = formData.name || formData.displayName.toUpperCase().replace(/\s+/g, '_');
      const tenantId = school?.id || user?.schoolId || "tenant-active";

      const payload = {
        name: generatedName,
        displayName: formData.displayName,
        description: formData.description,
        color: formData.color,
        permissionIds: formData.selectedPermissions,
        tenantId
      };

      const res = formData.id 
        ? await apiClient.put(`/roles/${formData.id}?tenantId=${tenantId}`, payload)
        : await apiClient.post(`/roles?tenantId=${tenantId}`, payload);

      const targetId = formData.id || (res.ok && (res.data as any)?.id) || `role-${Date.now()}`;

      const savedRole: TenantRole = {
        id: targetId,
        name: generatedName,
        displayName: formData.displayName,
        description: formData.description,
        color: formData.color,
        tenantId,
        permissions: formData.selectedPermissions.map(pId => ({ permissionId: pId })),
        _count: { userRoles: 0 }
      };

      setRoles(prev => {
        if (formData.id) {
          return prev.map(r => r.id === formData.id ? savedRole : r);
        } else {
          return [savedRole, ...prev];
        }
      });

      setIsCreateModalOpen(false);
      setFormData({ id: "", name: "", displayName: "", description: "", color: "#2563eb", selectedPermissions: [] });
      toast.success(formData.id ? "Role Updated" : "Custom Role Created", {
        description: `Role "${savedRole.displayName}" has been saved strictly for ${school?.name || "your school"}.`
      });
    } catch (error) {
      console.error("Error saving role", error);
      toast.error("Failed to save role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (roleId === "role-admin") {
      alert("The Root School Administrator role cannot be deleted.");
      return;
    }
    if (!confirm("Are you sure you want to delete this custom role?")) return;
    try {
      await apiClient.delete(`/roles/${roleId}?tenantId=${school?.id || user?.schoolId}`);
      setRoles(prev => prev.filter(r => r.id !== roleId));
      toast.success("Role deleted from organization");
    } catch (error) {
      toast.error("Failed to delete role");
    }
  };

  const openEditModal = (role: TenantRole) => {
    setFormData({
      id: role.id,
      name: role.name,
      displayName: role.displayName,
      description: role.description || "",
      color: role.color || "#2563eb",
      selectedPermissions: role.permissions?.map((p: any) => p.permissionId) || []
    });
    setIsCreateModalOpen(true);
  };

  const togglePermission = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPermissions: prev.selectedPermissions.includes(id) 
        ? prev.selectedPermissions.filter(pId => pId !== id)
        : [...prev.selectedPermissions, id]
    }));
  };

  const toggleSelectAllPermissions = () => {
    if (formData.selectedPermissions.length === SYSTEM_PERMISSIONS_CATALOG.length) {
      setFormData(prev => ({ ...prev, selectedPermissions: [] }));
    } else {
      setFormData(prev => ({ ...prev, selectedPermissions: SYSTEM_PERMISSIONS_CATALOG.map(p => p.id) }));
    }
  };

  // Group permissions by subject
  const groupedPermissions = SYSTEM_PERMISSIONS_CATALOG.reduce((acc: Record<string, PermissionItem[]>, p) => {
    if (!acc[p.subject]) acc[p.subject] = [];
    acc[p.subject].push(p);
    return acc;
  }, {});

  const filteredRoles = roles.filter(r => 
    r.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Custom Roles & Permissions"
        count={roles.length}
        addLabel="Create Custom Role"
        onAdd={() => {
          setFormData({ id: "", name: "", displayName: "", description: "", color: "#2563eb", selectedPermissions: ["perm-students-read"] });
          setIsCreateModalOpen(true);
        }}
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle>Tenant Role Definitions</CardTitle>
              <CardDescription>
                Configure fine-grained operational roles for <span className="font-semibold text-foreground">{school?.name || "your school"}</span>.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search roles..."
                  className="pl-8 w-[220px] h-9 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground text-sm">Loading roles...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRoles.map((role) => (
                <Card key={role.id} className="overflow-hidden border hover:shadow-md transition-shadow bg-card flex flex-col justify-between">
                  <div>
                    <div className="h-1.5 w-full" style={{ backgroundColor: role.color || '#2563eb' }} />
                    <CardHeader className="pb-3 pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base font-bold text-foreground">{role.displayName}</CardTitle>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{role.name}</p>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold">
                          {role._count?.userRoles || 0} Staff
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-xs text-muted-foreground line-clamp-2 min-h-8">
                        {role.description || "Custom role scoped to this institution."}
                      </p>
                    </CardContent>
                  </div>

                  <div className="p-4 pt-3 border-t flex justify-between items-center bg-muted/10">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {role.permissions?.length || 0} Permissions
                    </span>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => openEditModal(role)}>
                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                      </Button>
                      {role.id !== "role-admin" && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10" onClick={() => handleDeleteRole(role.id)}>
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE / EDIT ROLE MODAL */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card">
          <DialogHeader>
            <DialogTitle>{formData.id ? "Edit Custom Role" : "Create Tenant Custom Role"}</DialogTitle>
            <DialogDescription>
              Define the role title and select the exact operational permissions for this campus.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Display Title <span className="text-destructive">*</span></label>
                <Input 
                  placeholder="e.g. Dean of Students" 
                  required 
                  value={formData.displayName}
                  onChange={e => setFormData({
                    ...formData, 
                    displayName: e.target.value, 
                    name: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '_')
                  })}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">System Code</label>
                <Input 
                  placeholder="e.g. DEAN_OF_STUDENTS" 
                  required 
                  disabled
                  value={formData.name}
                  className="h-9 text-xs bg-muted font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Role Responsibilities / Notes</label>
              <Textarea 
                placeholder="Briefly describe what this custom role can do..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="text-xs"
                rows={2}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Color Identifier</label>
              <div className="flex items-center gap-3">
                <Input 
                  type="color" 
                  value={formData.color}
                  onChange={e => setFormData({...formData, color: e.target.value})}
                  className="h-8 w-16 p-0.5 cursor-pointer rounded-lg border"
                />
                <span className="text-xs text-muted-foreground">Used as a visual badge across staff lists.</span>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-xs text-foreground uppercase tracking-wider">Granular Permission Matrix</h4>
                  <p className="text-[11px] text-muted-foreground">Select the capabilities granted to staff with this role.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={toggleSelectAllPermissions} className="h-7 text-xs">
                  {formData.selectedPermissions.length === SYSTEM_PERMISSIONS_CATALOG.length ? "Deselect All" : "Select All"}
                </Button>
              </div>

              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([subject, perms]) => (
                  <div key={subject} className="p-3.5 bg-muted/20 rounded-xl border space-y-2">
                    <h5 className="font-semibold text-xs text-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                      {subject} Management
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {perms.map(p => {
                        const isChecked = formData.selectedPermissions.includes(p.id);
                        return (
                          <label 
                            key={p.id} 
                            onClick={() => togglePermission(p.id)}
                            className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                              isChecked ? "bg-primary/10 border-primary/30 text-primary font-medium" : "bg-card hover:bg-muted/40 text-muted-foreground"
                            }`}
                          >
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              onChange={() => {}} 
                              className="w-3.5 h-3.5 rounded text-primary" 
                            />
                            <span>{p.action} {p.subject.toLowerCase()}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="pt-4 border-t flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting || formData.selectedPermissions.length === 0}>
                {isSubmitting ? "Saving..." : (formData.id ? "Update Role" : "Create Role")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
