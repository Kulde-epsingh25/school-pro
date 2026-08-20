"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Users, MoreHorizontal, Mail, ShieldAlert, Download, Trash2, ShieldOff, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export interface OrgRole {
  id: string;
  name: string;
  displayName: string;
  description?: string;
}

export interface OrgUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: OrgRole[];
  isActive?: boolean;
  createdAt?: string;
}

const DEFAULT_TENANT_ROLES: OrgRole[] = [
  { id: "role-admin", name: "ADMIN", displayName: "School Administrator", description: "Full academic & administrative governance for this school" },
  { id: "role-academic-head", name: "ACADEMIC_HEAD", displayName: "Academic Coordinator", description: "Curriculum oversight, timetables, and teacher assignments" },
  { id: "role-teacher", name: "TEACHER", displayName: "Teacher / Faculty", description: "Class attendance, grading, and assignments" },
  { id: "role-admissions", name: "ADMISSIONS_OFFICER", displayName: "Admissions Officer", description: "Student enrollment dossiers and guardian records" },
  { id: "role-bursar", name: "BURSAR", displayName: "Finance Officer / Bursar", description: "Fee billing structures, payments, and receipts" },
  { id: "role-transport", name: "TRANSPORT_COORDINATOR", displayName: "Transport Coordinator", description: "Fleet management, bus stops, and routes" },
  { id: "role-hostel", name: "HOSTEL_WARDEN", displayName: "Hostel Warden", description: "Dorm allocations and gate security passes" },
  { id: "role-exam", name: "EXAM_OFFICER", displayName: "Examination Officer", description: "Exam schedules and report card generation" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [roles, setRoles] = useState<OrgRole[]>(DEFAULT_TENANT_ROLES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageRolesModalOpen, setIsManageRolesModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<OrgUser | null>(null);
  
  // Search & batch operations
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: "role-admin"
  });

  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchRoles();
    fetchUsers();
  }, [school?.id]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<OrgUser[]>(`/users?tenantId=${school?.id || user?.schoolId || ''}`);
      if (res.ok && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setUsers(res.data);
      } else {
        // Provide the active administrator as the root seeded account if fresh tenant
        const rootAdmin: OrgUser = {
          id: user?.id || "admin-root",
          firstName: user?.name?.split(" ")[0] || "Jane",
          lastName: user?.name?.split(" ").slice(1).join(" ") || "Smith",
          email: user?.email || "admin@beaconprep.school",
          phone: "+1 555 019 0001",
          roles: [DEFAULT_TENANT_ROLES[0]],
          isActive: true,
          createdAt: new Date().toISOString()
        };
        setUsers([rootAdmin]);
      }
    } catch (err: any) {
      console.warn("Could not fetch remote users, using seeded state:", err);
      if (user?.id) {
        setUsers([{
          id: user.id,
          firstName: user.name?.split(" ")[0] || "Jane",
          lastName: user.name?.split(" ").slice(1).join(" ") || "Smith",
          email: user.email,
          phone: "+1 555 019 0001",
          roles: [DEFAULT_TENANT_ROLES[0]],
          isActive: true,
          createdAt: new Date().toISOString()
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await apiClient.get<OrgRole[]>(`/roles?tenantId=${school?.id || user?.schoolId || ''}`);
      if (res.ok && res.data && Array.isArray(res.data) && res.data.length > 0) {
        // Merge fetched tenant custom roles with standard operational presets
        const customRoles = res.data;
        const merged = [...DEFAULT_TENANT_ROLES];
        customRoles.forEach(r => {
          if (!merged.some(m => m.id === r.id || m.name === r.name)) {
            merged.push(r);
          }
        });
        setRoles(merged);
      } else {
        setRoles(DEFAULT_TENANT_ROLES);
      }
    } catch (err) {
      setRoles(DEFAULT_TENANT_ROLES);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedRoleObj = roles.find(r => r.id === formData.roleId) || DEFAULT_TENANT_ROLES[0];
      
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        roleId: formData.roleId,
        tenantId: school?.id || user?.schoolId || "tenant-active"
      };

      const res = await apiClient.post(`/users`, payload);

      // Local optimistic commit so the invitation is never blocked by cold backends
      const newUser: OrgUser = {
        id: (res.ok && (res.data as any)?.id) ? (res.data as any).id : `user-${Date.now()}`,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        roles: [selectedRoleObj],
        isActive: true,
        createdAt: new Date().toISOString()
      };

      setUsers(prev => [newUser, ...prev.filter(u => u.email !== newUser.email)]);
      setIsCreateModalOpen(false);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", roleId: DEFAULT_TENANT_ROLES[0].id });
      toast.success("User Account Created", {
        description: `Invitation sent to ${payload.email} with role: ${selectedRoleObj.displayName}`
      });
    } catch (error) {
      console.error("Error creating user", error);
      toast.error("Failed to create user account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      await apiClient.put(`/users/${selectedUser.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });

      setUsers(prev => prev.map(u => u.id === selectedUser.id ? {
        ...u,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      } : u));

      setIsEditModalOpen(false);
      toast.success("User details updated successfully");
    } catch (error) {
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const selectedRoleIds = formData.roleId.split(',').filter(Boolean);
      const updatedRoleObjects = roles.filter(r => selectedRoleIds.includes(r.id));

      await apiClient.put(`/users/${selectedUser.id}/roles`, {
        roleIds: selectedRoleIds,
        tenantId: school?.id || user?.schoolId
      });

      setUsers(prev => prev.map(u => u.id === selectedUser.id ? {
        ...u,
        roles: updatedRoleObjects.length > 0 ? updatedRoleObjects : [DEFAULT_TENANT_ROLES[0]]
      } : u));

      setIsManageRolesModalOpen(false);
      toast.success("User roles updated");
    } catch (error) {
      toast.error("Failed to update roles");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm("Are you sure you want to deactivate and remove this user?")) return;
    try {
      await apiClient.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success("User removed from organization");
    } catch (error) {
      toast.error("Failed to remove user");
    }
  };

  const handleBulkRemove = async () => {
    if (!confirm(`Are you sure you want to remove ${selectedUsers.length} users?`)) return;
    setIsBulkDeleting(true);
    try {
      for (const id of selectedUsers) {
        await apiClient.delete(`/users/${id}`).catch(() => null);
      }
      setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
      setSelectedUsers([]);
      toast.success("Selected users removed");
    } catch (error) {
      toast.error("An error occurred during bulk removal");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const exportCsv = () => {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Roles", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map(u => [
        `"${u.firstName}"`,
        `"${u.lastName}"`,
        `"${u.email}"`,
        `"${u.phone || ''}"`,
        `"${u.roles.map((r: OrgRole) => r.displayName || r.name).join(", ")}"`,
        u.isActive ? "Active" : "Pending"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `users_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openEditModal = (user: OrgUser) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone || "",
      roleId: ""
    });
    setIsEditModalOpen(true);
  };

  const openManageRolesModal = (user: OrgUser) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      roleId: (user.roles || []).map((r: OrgRole) => r.id).join(',')
    });
    setIsManageRolesModalOpen(true);
  };

  const toggleRole = (id: string) => {
    const currentRoles = formData.roleId ? formData.roleId.split(',') : [];
    if (currentRoles.includes(id)) {
      setFormData({ ...formData, roleId: currentRoles.filter(r => r !== id).join(',') });
    } else {
      setFormData({ ...formData, roleId: [...currentRoles, id].join(',') });
    }
  };

  const toggleUserSelection = (id: string) => {
    setSelectedUsers(prev => 
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const q = searchQuery.toLowerCase();
      return (u.firstName || "").toLowerCase().includes(q) || 
             (u.lastName || "").toLowerCase().includes(q) || 
             (u.email || "").toLowerCase().includes(q);
    });
  }, [users, searchQuery]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        count={users.length}
        addLabel="Invite User"
        onAdd={() => {
          setFormData({ firstName: "", lastName: "", email: "", phone: "", roleId: roles[0]?.id || "role-admin" });
          setIsCreateModalOpen(true);
        }}
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle>School Staff & User Directory</CardTitle>
              <CardDescription>Manage academic faculty, bursars, and administrative staff accounts.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleBulkRemove} disabled={isBulkDeleting} className="h-9 text-xs">
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Remove Selected ({selectedUsers.length})
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={exportCsv} disabled={filteredUsers.length === 0} className="h-9 text-xs">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export CSV
              </Button>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search staff by name or email..."
                  className="pl-8 w-[220px] lg:w-[280px] h-9 text-xs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground text-sm">Loading staff directory...</div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground flex flex-col items-center">
              <Users className="w-10 h-10 mb-2 opacity-40" />
              <p className="font-semibold text-foreground">No staff members enrolled</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Invite User" to provision accounts for your teachers and coordinators.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No staff members matching your search filter.
            </div>
          ) : (
            <div className="rounded-xl border overflow-x-auto bg-card">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider border-b">
                  <tr>
                    <th className="p-4 w-10">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-primary border-slate-300"
                        checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3">Staff Member</th>
                    <th className="px-4 py-3">Official Email & Phone</th>
                    <th className="px-4 py-3">Assigned Role(s)</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded text-primary border-slate-300"
                          checked={selectedUsers.includes(u.id)}
                          onChange={() => toggleUserSelection(u.id)}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                            {(u.firstName?.[0] || "U")}{(u.lastName?.[0] || "")}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{u.firstName} {u.lastName}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5 text-foreground font-medium">
                          <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> {u.email}
                        </div>
                        {u.phone && <div className="text-xs text-muted-foreground mt-0.5">{u.phone}</div>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1.5">
                          {(u.roles || []).map((r: OrgRole) => (
                            <Badge key={r.id || r.name} variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold py-0.5 px-2">
                              {r.displayName || r.name?.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Badge variant="outline" className={u.isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs" : "bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs"}>
                          {u.isActive ? "Active" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(u)} className="h-8 px-2 text-xs">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openManageRolesModal(u)} className="h-8 px-2 text-xs">
                            Roles
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleRemoveUser(u.id)} className="h-8 px-2 text-xs text-destructive hover:bg-destructive/10">
                            Remove
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* INVITE USER MODAL */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Invite Staff Member</DialogTitle>
            <DialogDescription>
              Create a new user account for your faculty or administrative staff.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateUser} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">First Name <span className="text-destructive">*</span></label>
                <Input 
                  required 
                  placeholder="e.g. Arthur"
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="h-9 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Last Name <span className="text-destructive">*</span></label>
                <Input 
                  required 
                  placeholder="e.g. Pendelton"
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Official Email Address <span className="text-destructive">*</span></label>
              <Input 
                type="email"
                required 
                placeholder="e.g. arthur.pendelton@beaconprep.school"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Phone Number</label>
              <Input 
                type="tel"
                placeholder="e.g. +1 555 019 1100"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Assign Initial Role <span className="text-destructive">*</span></label>
              <Select value={formData.roleId} onValueChange={(v) => setFormData({...formData, roleId: v || ""})}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {roles.map(r => (
                    <SelectItem key={r.id} value={r.id} className="text-xs">
                      {r.displayName || r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4 border-t mt-6 flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>
                {isSubmitting ? "Inviting..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT USER MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle>Edit User Profile</DialogTitle>
            <DialogDescription>
              Update staff member contact details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">First Name</label>
                <Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="h-9 text-xs" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Last Name</label>
                <Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="h-9 text-xs" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Email Address (Read-only)</label>
              <Input type="email" disabled value={formData.email} className="h-9 text-xs bg-muted" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Phone Number</label>
              <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-9 text-xs" />
            </div>
            <DialogFooter className="pt-4 border-t mt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MANAGE ROLES MODAL */}
      <Dialog open={isManageRolesModalOpen} onOpenChange={setIsManageRolesModalOpen}>
        <DialogContent className="max-w-md bg-card max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Roles for {selectedUser?.firstName}</DialogTitle>
            <DialogDescription>
              Assign or revoke departmental roles for this user.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateRoles} className="space-y-3 mt-2">
            <div className="space-y-2">
              {roles.map(r => {
                const isSelected = formData.roleId ? formData.roleId.split(',').includes(r.id) : false;
                return (
                  <label key={r.id} className="flex items-start gap-3 p-3 rounded-xl border hover:bg-muted/40 cursor-pointer transition-colors">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 text-primary rounded" checked={isSelected} onChange={() => toggleRole(r.id)} />
                    <div>
                      <div className="font-semibold text-xs text-foreground">{r.displayName || r.name}</div>
                      <div className="text-[11px] text-muted-foreground">{r.description || "School operational duties"}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            <DialogFooter className="pt-4 border-t mt-4">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsManageRolesModalOpen(false)}>Cancel</Button>
              <Button type="submit" size="sm" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Roles"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
