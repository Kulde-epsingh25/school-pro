"use client";

import React, { useState, useEffect } from "react";
import { Check, X, Calendar, Plus } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LeavesPage() {
  const { school } = useSchoolStore();
  const user = useAuthStore(state => state.user);
  
  const [balance, setBalance] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  const [leaveType, setLeaveType] = useState("CASUAL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (school?.id && user?.id) {
      fetchBalance();
      fetchApplications();
    }
  }, [school?.id, user?.id]);

  const fetchBalance = async () => {
    try {
      const res = await apiClient.get<any>(`/leaves/balance?tenantId=${school?.id}&userId=${user?.id}`);
      if (res.ok && res.data) setBalance(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await apiClient.get<any[]>(`/leaves/applications?tenantId=${school?.id}`);
      if (res.ok && res.data) setApplications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/leaves/apply?tenantId=${school?.id}`, {
        userId: user?.id,
        type: leaveType,
        startDate,
        endDate,
        reason
      });
      setShowForm(false);
      fetchApplications();
      fetchBalance(); // Refresh balance just in case
    } catch (err) {
      console.error("Failed to apply leave", err);
    }
  };

  const handleApprove = async (id: string, status: string) => {
    try {
      await apiClient.put(`/leaves/${id}/approve?tenantId=${school?.id}`, {
        status,
        comments: status === "REJECTED" ? "Rejected by Admin" : "Approved by Admin"
      });
      fetchApplications();
    } catch (err) {
      console.error("Failed to approve leave", err);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-2">Manage leave applications and view balances.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Apply for Leave
        </Button>
      </div>

      {/* Balance Cards */}
      {balance && (
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Casual Leaves</p>
              <h3 className="text-2xl font-bold">{balance.casual} Left</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Calendar className="w-6 h-6" /></div>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Sick Leaves</p>
              <h3 className="text-2xl font-bold">{balance.sick} Left</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg"><Calendar className="w-6 h-6" /></div>
          </div>
          <div className="bg-white p-4 rounded-xl border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Unpaid Leaves</p>
              <h3 className="text-2xl font-bold">Unlimited</h3>
            </div>
            <div className="p-3 bg-gray-50 text-gray-600 rounded-lg"><Calendar className="w-6 h-6" /></div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <h2 className="text-lg font-bold mb-4">Apply for Leave</h2>
          <form onSubmit={handleApply} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Leave Type</label>
                <select 
                  value={leaveType} 
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="CASUAL">Casual</option>
                  <option value="SICK">Sick</option>
                  <option value="UNPAID">Unpaid</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold mb-1 block">Start Date</label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1 block">End Date</label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1 block">Reason</label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} required placeholder="Brief reason for leave..." />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="bg-blue-600">Submit Application</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b font-semibold bg-gray-50">Recent Applications</div>
        <table className="w-full text-sm text-left">
          <thead className="bg-white text-gray-700 border-b">
            <tr>
              <th className="px-6 py-3">Applicant</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id} className="border-t bg-white">
                <td className="px-6 py-4 font-medium">
                  {app.user?.firstName} {app.user?.lastName}
                  <div className="text-xs text-gray-400 font-normal">{app.reason}</div>
                </td>
                <td className="px-6 py-4">{app.type}</td>
                <td className="px-6 py-4">
                  {new Date(app.startDate).toLocaleDateString()} to {new Date(app.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    app.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                    app.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {app.status === 'PENDING' ? (
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700" onClick={() => handleApprove(app.id, 'APPROVED')}>
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700" onClick={() => handleApprove(app.id, 'REJECTED')}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
            {applications.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No leave applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
