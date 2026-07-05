"use client";

import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Globe, Users, Briefcase, Calendar, Building, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { TableFilters } from "@/components/dashboard/table-filters";
import { TablePagination } from "@/components/dashboard/table-pagination";

interface Contact {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  schoolName: string;
  country: string;
  schoolWebsite: string | null;
  students: number | null;
  role: string;
  media: string | null;
  painPoints: string;
  createdAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [search]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com")}/contacts${search ? `?search=${encodeURIComponent(search)}` : ""}`);
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch (error) {
      console.error("Failed to fetch contacts", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/50 min-h-screen">
      <PageHeader 
        title="Contacts" 
        count={contacts.length} 
        onAdd={() => {}}
        onExport={() => {}}
        onImport={() => {}}
        addLabel="Add Contact"
      />

      <div className="bg-white rounded-md shadow-sm border">
        <TableFilters 
          search={search} 
          setSearch={setSearch} 
          searchPlaceholder="Search products..." 
          dateRange="Jan 20, 2024 - Feb 09, 2024"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-white border-b">
              <tr>
                <th className="px-6 py-4 font-medium flex items-center gap-1">Name <ArrowUpDown className="w-3 h-3" /></th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">School</th>
                <th className="px-6 py-4 font-medium">Country</th>
                <th className="px-6 py-4 font-medium">View</th>
                <th className="px-6 py-4 font-medium">Date Created</th>
                <th className="px-6 py-4 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-500">Loading...</td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-8 text-gray-500">No contacts found</td></tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="border-b hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-gray-900 font-medium">{contact.fullName}</td>
                    <td className="px-6 py-4 text-gray-600">{contact.email}</td>
                    <td className="px-6 py-4 text-gray-600">{contact.phone || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{contact.schoolName}</td>
                    <td className="px-6 py-4 text-gray-600">{contact.country}</td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={() => setSelectedContact(contact)}>View</Button>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination 
          totalItems={contacts.length} 
          currentPage={1} 
          totalPages={1} 
          pageSize={10} 
        />
      </div>

      {selectedContact && (
        <Dialog open={!!selectedContact} onOpenChange={(open) => !open && setSelectedContact(null)}>
          <DialogContent className="max-w-3xl border-0 shadow-lg sm:rounded-2xl">
            <DialogHeader className="pb-4">
              <DialogTitle className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-lg font-bold text-gray-900 border">
                  {selectedContact.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-xl font-bold text-gray-900">{selectedContact.fullName}</h2>
                  <div className="w-fit">
                    <span className="text-xs bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600 font-medium">Via {selectedContact.media || 'blog'}</span>
                  </div>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="p-5 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-sm bg-white">
                <Mail className="w-6 h-6 text-blue-600 mb-1" />
                <span className="font-semibold text-sm text-gray-900">Email</span>
                <span className="text-xs text-gray-500 break-all">{selectedContact.email}</span>
              </div>
              <div className="p-5 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-sm bg-white">
                <Phone className="w-6 h-6 text-blue-600 mb-1" />
                <span className="font-semibold text-sm text-gray-900">Phone</span>
                <span className="text-xs text-gray-500">{selectedContact.phone || "-"}</span>
              </div>
              <div className="p-5 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-sm bg-white">
                <Building className="w-6 h-6 text-blue-600 mb-1" />
                <span className="font-semibold text-sm text-gray-900">School</span>
                <span className="text-xs text-gray-500">{selectedContact.schoolName}</span>
              </div>
              <div className="p-5 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-sm bg-white">
                <MapPin className="w-6 h-6 text-blue-600 mb-1" />
                <span className="font-semibold text-sm text-gray-900">Country</span>
                <span className="text-xs text-gray-500">{selectedContact.country}</span>
              </div>
              <div className="p-5 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-sm bg-white">
                <Globe className="w-6 h-6 text-blue-600 mb-1" />
                <span className="font-semibold text-sm text-gray-900">School Page</span>
                <span className="text-xs text-blue-500 hover:underline break-all">{selectedContact.schoolWebsite || "-"}</span>
              </div>
              <div className="p-5 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-sm bg-white">
                <Users className="w-6 h-6 text-blue-600 mb-1" />
                <span className="font-semibold text-sm text-gray-900">Students</span>
                <span className="text-xs text-gray-500">{selectedContact.students || "-"}</span>
              </div>
              <div className="p-5 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-sm bg-white">
                <Briefcase className="w-6 h-6 text-blue-600 mb-1" />
                <span className="font-semibold text-sm text-gray-900">Role</span>
                <span className="text-xs text-gray-500">{selectedContact.role}</span>
              </div>
              <div className="p-5 border border-gray-100 rounded-xl flex flex-col items-center justify-center text-center gap-2 shadow-sm bg-white">
                <Calendar className="w-6 h-6 text-blue-600 mb-1" />
                <span className="font-semibold text-sm text-gray-900">Joined</span>
                <span className="text-xs text-gray-500">{new Date(selectedContact.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-4 border-t border-gray-100 pt-4 hidden">
              <h3 className="font-semibold text-sm mb-2">Pain Points</h3>
              <p className="text-sm text-gray-600">{selectedContact.painPoints}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
