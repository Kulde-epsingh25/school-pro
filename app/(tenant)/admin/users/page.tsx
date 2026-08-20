"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, Users, MoreHorizontal, Mail, ShieldAlert, Download, Trash2, ShieldOff, AlertCircle, RefreshCw } from "lucide-react";
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
import type { User } from "@/types/dashboard";

interface OrgRole {
  id: string;
  name: string;
  displayName: string;
  description?: string;
}

interface OrgUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: OrgRole[];
  isActive?: boolean;
  createdAt?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<OrgUser[]>([]);
  const [roles, setRoles] = useState<OrgRole[]>([]);
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
    roleId: ""
  });

  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (school?.id) {
      fetchUsers();
      fetchRoles();
    } else {
      setLoading(false);
    }
  }, [school?.id]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<OrgUser[]>(`/users`);
      if (res.ok && res.data) {
        setUsers(Array.isArray(res.data) ? res.data : []);
        setSelectedUsers([]);
      } else {
        throw new Error(res.error || "Failed to load user accounts from API");
      }
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setError(err?.message || "Failed to fetch users from server.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await apiClient.get<OrgRole[]>(`/roles`);
      if (res.ok && res.data) {
        setRoles(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiClient.post(`/users`, formData);

      if (res.ok) {
        setIsCreateModalOpen(false);
        setFormData({ firstName: "", lastName: "", email: "", phone: "", roleId: "" });
        fetchUsers();
      } else {
        alert(res.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user", error);
      alert("Error creating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.put(`/users/${selectedUser.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        alert(res.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user", error);
      alert("Error updating user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.put(`/users/${selectedUser.id}/roles`, {
        roleIds: formData.roleId.split(',').filter(Boolean)
      });

      if (res.ok) {
        setIsManageRolesModalOpen(false);
        fetchUsers();
      } else {
        alert(res.error || "Failed to update roles");
      }
    } catch (error) {
      console.error("Error updating roles", error);
      alert("Error updating roles");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this user from the organization?")) return;
    try {
      const res = await apiClient.delete(`/users/${userId}`);
      if (res.ok) {
        fetchUsers();
      } else {
        alert(res.error || "Failed to remove user");
      }
    } catch (error) {
      console.error("Error removing user", error);
      alert("Error removing user");
    }
  };

  const handleBulkRemove = async () => {
    if (!confirm(`Are you sure you want to remove ${selectedUsers.length} users?`)) return;
    setIsBulkDeleting(true);
    try {
      for (const id of selectedUsers) {
        await apiClient.delete(`/users/${id}`);
      }
      fetchUsers();
    } catch (error) {
      alert("An error occurred during bulk removal");
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
        `"${u.roles.map((r: OrgRole) => r.name).join(", ")}"`,
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
        onAdd={() => setIsCreateModalOpen(true)}
      />

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <CardTitle>Organization Users</CardTitle>
              <CardDescription>Manage staff accounts and their assigned roles.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="outline" className="text-muted-foreground border-dashed">
                      Bulk Actions ({selectedUsers.length})
                    </Button>
                  } />
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-destructive" onClick={handleBulkRemove} disabled={isBulkDeleting}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      {isBulkDeleting ? "Removing..." : "Remove Selected"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button variant="outline" onClick={exportCsv} disabled={filteredUsers.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users by name or email..."
                  className="pl-8 w-[250px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-destructive">User Directory Issue</p>
                  <p className="text-xs text-muted-foreground">{error}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={fetchUsers} className="gap-2 h-8 text-xs">
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </Button>
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No users found. Invite a new user to get started.
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No users matching your search.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <div className="min-w-[800px] grid grid-cols-[auto_4fr_3fr_3fr_1fr_1fr] gap-4 p-4 font-semibold text-sm border-b bg-slate-50 text-slate-600 items-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded text-primary border-slate-300"
                  checked={selectedUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                  onChange={toggleSelectAll}
                />
                <div>User</div>
                <div>Contact</div>
                <div>Roles</div>
                <div className="text-center">Status</div>
                <div className="text-right">Actions</div>
              </div>
              <div className="divide-y min-w-[800px]">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="grid grid-cols-[auto_4fr_3fr_3fr_1fr_1fr] gap-4 p-4 items-center text-sm hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded text-primary border-slate-300"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {(user.firstName?.[0] || "U")}{(user.lastName?.[0] || "")}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="text-slate-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {user.email}
                      </div>
                      {user.phone && <div className="text-xs text-muted-foreground mt-1">{user.phone}</div>}
                    </div>
                    <div>
                      <div className="flex flex-wrap gap-1">
                        {(user.roles || []).map((role: OrgRole) => (
                          <Badge key={role.id} variant="outline" className="bg-primary/5 text-xs font-normal">
                            {role.name ? role.name.replace('_', ' ') : role.displayName}
                          </Badge>
                        ))}
                        {(!user.roles || user.roles.length === 0) && <span className="text-muted-foreground text-xs italic">No roles</span>}
                      </div>
                    </div>
                    <div className="text-center">
                      <Badge variant="outline" className={user.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}>
                        {user.isActive ? "Active" : "Pending"}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger render={
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        } />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditModal(user)}>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openManageRolesModal(user)}>Manage Roles</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleRemoveUser(user.id)}>Deactivate / Remove</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Create a new user account and send them an invitation email to set their password.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                <Input 
                  required 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
                <Input 
                  required 
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address <span className="text-red-500">*</span></label>
              <Input 
                type="email"
                required 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input 
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Initial Role</label>
              <Select value={formData.roleId} onValueChange={(v) => setFormData({...formData, roleId: v || ""})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.displayName || role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Inviting..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Details</DialogTitle>
            <DialogDescription>
              Update the user's personal information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name <span className="text-red-500">*</span></label>
                <Input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name <span className="text-red-500">*</span></label>
                <Input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address (Cannot be changed)</label>
              <Input type="email" disabled value={formData.email} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <DialogFooter className="pt-4 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Updating..." : "Save Changes"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isManageRolesModalOpen} onOpenChange={setIsManageRolesModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Roles for {selectedUser?.firstName}</DialogTitle>
            <DialogDescription>
              Assign or remove roles for this user in the organization.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateRoles} className="space-y-4 mt-4">
            <div className="space-y-3">
              {roles.map(role => {
                const isSelected = formData.roleId ? formData.roleId.split(',').includes(role.id) : false;
                return (
                  <label key={role.id} className="flex items-start gap-3 p-3 rounded border hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 text-primary" checked={isSelected} onChange={() => toggleRole(role.id)} />
                    <div>
                      <div className="font-medium text-sm">{role.displayName || role.name}</div>
                      <div className="text-xs text-muted-foreground">{role.description || "No description"}</div>
                    </div>
                  </label>
                );
              })}
              {roles.length === 0 && <div className="text-sm text-muted-foreground">No roles available in this organization.</div>}
            </div>
            <DialogFooter className="pt-4 border-t mt-6">
              <Button type="button" variant="outline" onClick={() => setIsManageRolesModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Roles"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
