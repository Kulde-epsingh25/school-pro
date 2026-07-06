"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Users, MoreHorizontal, Mail, ShieldAlert } from "lucide-react";
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
import { PageHeader } from "@/components/dashboard/page-header";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageRolesModalOpen, setIsManageRolesModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: ""
  });

  const school = useSchoolStore((state) => state.school);

  useEffect(() => {
    if (school?.id) {
      fetchUsers();
      fetchRoles();
    }
  }, [school?.id]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`\/users?tenantId=${school?.id}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`\/roles?tenantId=${school?.id}`);
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`\/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tenantId: school?.id,
          ...formData
        })
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        setFormData({ firstName: "", lastName: "", email: "", phone: "", roleId: "" });
        fetchUsers(); // Refresh the list
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create user");
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
    setIsSubmitting(true);
    try {
      const res = await fetch(`\/users/${selectedUser.id}?tenantId=${school?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        })
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update user");
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
    setIsSubmitting(true);
    try {
      const res = await fetch(`\/users/${selectedUser.id}/roles?tenantId=${school?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roleIds: formData.roleId.split(',').filter(Boolean)
        })
      });

      if (res.ok) {
        setIsManageRolesModalOpen(false);
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update roles");
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
      const res = await fetch(`\/users/${userId}?tenantId=${school?.id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to remove user");
      }
    } catch (error) {
      console.error("Error removing user", error);
      alert("Error removing user");
    }
  };

  const openEditModal = (user: any) => {
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

  const openManageRolesModal = (user: any) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      roleId: user.roles.map((r: any) => r.id).join(',')
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Organization Users</CardTitle>
              <CardDescription>Manage staff accounts and their assigned roles.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users by name or email..."
                  className="pl-8 w-[300px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No users found. Invite a new user to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-sm border-b bg-slate-50 text-slate-600">
                <div className="col-span-4">User</div>
                <div className="col-span-3">Contact</div>
                <div className="col-span-3">Roles</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              <div className="divide-y">
                {users.map((user) => (
                  <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center text-sm hover:bg-slate-50 transition-colors">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="col-span-3 text-slate-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" /> {user.email}
                      </div>
                      {user.phone && <div className="text-xs text-muted-foreground mt-1">{user.phone}</div>}
                    </div>
                    <div className="col-span-3">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role: any) => (
                          <Badge key={role.id} variant="outline" className="bg-primary/5 text-xs font-normal">
                            {role.name.replace('_', ' ')}
                          </Badge>
                        ))}
                        {user.roles.length === 0 && <span className="text-muted-foreground text-xs italic">No roles</span>}
                      </div>
                    </div>
                    <div className="col-span-1 text-center">
                      <Badge variant="outline" className={user.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-amber-50 text-amber-600 border-amber-200"}>
                        {user.isActive ? "Active" : "Pending"}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-right">
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
                      {role.displayName}
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
                      <div className="font-medium text-sm">{role.displayName}</div>
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
