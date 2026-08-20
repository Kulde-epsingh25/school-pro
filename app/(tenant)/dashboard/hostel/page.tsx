"use client";

import React, { useState, useEffect } from "react";
import { Building, Bed, Users, UserCheck, Plus, Check, AlertCircle, RefreshCw } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HostelRoom {
  id: string;
  roomNo: string;
  capacity: number;
  currentOccupancy: number;
  feePerMonth: number;
}

interface Hostel {
  id: string;
  name: string;
  type: string;
  wardenName: string;
  wardenPhone?: string;
  rooms?: HostelRoom[];
}

interface HostelVisitor {
  id: string;
  visitorName: string;
  relation: string;
  reason?: string;
  status: "ACTIVE" | "COMPLETED";
  checkInTime: string;
  checkOutTime?: string;
  student?: {
    user?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

export default function HostelPage() {
  const { school } = useSchoolStore();
  const user = useAuthStore(state => state.user);
  
  const [activeTab, setActiveTab] = useState<"HOSTELS" | "VISITORS" | "MY_ROOM">("HOSTELS");
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [visitors, setVisitors] = useState<HostelVisitor[]>([]);
  const [myRoom, setMyRoom] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forms
  const [newHostel, setNewHostel] = useState({ name: "", type: "Co-ed", wardenName: "", wardenPhone: "" });
  const [newRoom, setNewRoom] = useState({ hostelId: "", roomNo: "", capacity: 2, feePerMonth: 0 });
  const [allocationData, setAllocationData] = useState({ studentId: "", roomId: "" });
  const [newVisitor, setNewVisitor] = useState({ studentId: "", visitorName: "", relation: "", reason: "" });

  useEffect(() => {
    if (school?.id) {
      fetchHostels();
      fetchVisitors();
      if (user?.id) fetchMyRoom();
    }
  }, [school?.id, user?.id]);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<Hostel[]>(`/hostel/all?tenantId=${school?.id}`);
      if (res.ok && res.data) {
        setHostels(Array.isArray(res.data) ? res.data : []);
      } else {
        throw new Error(res.error || "Failed to load hostel blocks");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load hostel facilities.");
      setHostels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitors = async () => {
    try {
      const res = await apiClient.get<HostelVisitor[]>(`/hostel/visitors?tenantId=${school?.id}`);
      if (res.ok && res.data) setVisitors(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyRoom = async () => {
    try {
      const res = await apiClient.get<any>(`/hostel/my-room?tenantId=${school?.id}&studentId=${user?.id}`);
      if (res.ok && res.data) setMyRoom(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateHostel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/hostel/create?tenantId=${school?.id}`, newHostel);
      setNewHostel({ name: "", type: "Co-ed", wardenName: "", wardenPhone: "" });
      fetchHostels();
      alert("Hostel created");
    } catch (err) {
      alert("Failed to create hostel");
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/hostel/rooms?tenantId=${school?.id}`, newRoom);
      setNewRoom({ hostelId: "", roomNo: "", capacity: 2, feePerMonth: 0 });
      fetchHostels();
      alert("Room added");
    } catch (err) {
      alert("Failed to add room");
    }
  };

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/hostel/allocate?tenantId=${school?.id}`, allocationData);
      setAllocationData({ studentId: "", roomId: "" });
      fetchHostels();
      alert("Student allocated to room");
    } catch (err: any) {
      alert(err.message || "Failed to allocate student. Room might be full.");
    }
  };

  const handleIssuePass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/hostel/visitors?tenantId=${school?.id}`, newVisitor);
      setNewVisitor({ studentId: "", visitorName: "", relation: "", reason: "" });
      fetchVisitors();
      alert("Visitor pass generated");
    } catch (err) {
      alert("Failed to generate visitor pass");
    }
  };

  const handleCheckoutVisitor = async (passId: string) => {
    try {
      await apiClient.post(`/hostel/visitors/checkout?tenantId=${school?.id}`, { passId });
      fetchVisitors();
      alert("Visitor checked out");
    } catch (err) {
      alert("Failed to checkout visitor");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Hostel Management</h1>
          <p className="text-muted-foreground mt-2">Manage properties, allocate rooms, and track visitors.</p>
        </div>
      </div>

      <div className="flex border-b">
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'HOSTELS' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('HOSTELS')}
        >
          Hostels & Rooms
        </button>
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'VISITORS' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('VISITORS')}
        >
          Visitor Logs (Gate Pass)
        </button>
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'MY_ROOM' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('MY_ROOM')}
        >
          My Room
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Hostel System Connection Notice</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchHostels} className="gap-2 h-8 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}

      {activeTab === 'HOSTELS' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" /> New Hostel
              </h2>
              <form onSubmit={handleCreateHostel} className="space-y-4">
                <Input placeholder="Hostel Name" value={newHostel.name} onChange={e => setNewHostel({...newHostel, name: e.target.value})} required />
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={newHostel.type} onChange={e => setNewHostel({...newHostel, type: e.target.value})}>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Co-ed">Co-ed</option>
                </select>
                <Input placeholder="Warden Name" value={newHostel.wardenName} onChange={e => setNewHostel({...newHostel, wardenName: e.target.value})} required />
                <Input placeholder="Warden Phone" value={newHostel.wardenPhone} onChange={e => setNewHostel({...newHostel, wardenPhone: e.target.value})} />
                <Button type="submit" className="w-full">Create</Button>
              </form>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" /> Allocate Room
              </h2>
              <form onSubmit={handleAllocate} className="space-y-4">
                <Input placeholder="Student ID" value={allocationData.studentId} onChange={e => setAllocationData({...allocationData, studentId: e.target.value})} required />
                <Input placeholder="Room ID" value={allocationData.roomId} onChange={e => setAllocationData({...allocationData, roomId: e.target.value})} required />
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Assign Room</Button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {hostels.map(h => (
              <div key={h.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{h.name} ({h.type})</h3>
                    <p className="text-xs text-muted-foreground">Warden: {h.wardenName} {h.wardenPhone ? `| ${h.wardenPhone}` : ""}</p>
                  </div>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {h.rooms?.length || 0} Rooms
                  </span>
                </div>
                
                <div className="p-4">
                  <form onSubmit={handleAddRoom} className="flex gap-2 mb-4 bg-muted/40 p-2 rounded border">
                    <Input placeholder="Room No" value={newRoom.roomNo} onChange={e => setNewRoom({...newRoom, hostelId: h.id, roomNo: e.target.value})} required className="w-24" />
                    <Input type="number" placeholder="Cap" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, hostelId: h.id, capacity: parseInt(e.target.value) || 2})} required className="w-20" />
                    <Input type="number" placeholder="Fee/mo ($)" value={newRoom.feePerMonth} onChange={e => setNewRoom({...newRoom, hostelId: h.id, feePerMonth: parseFloat(e.target.value) || 0})} className="w-28" />
                    <Button type="submit" size="sm"><Plus className="w-4 h-4" /></Button>
                  </form>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(h.rooms || []).map((r: HostelRoom) => (
                      <div key={r.id} className={`p-3 rounded border ${r.currentOccupancy >= r.capacity ? 'bg-destructive/5 border-destructive/30' : 'bg-card'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-sm">{r.roomNo}</span>
                          <span className="text-[10px] text-muted-foreground">ID: {r.id.slice(-4)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-3 h-3" />
                          <span className={r.currentOccupancy >= r.capacity ? 'text-destructive font-bold' : 'text-muted-foreground'}>
                            {r.currentOccupancy || 0} / {r.capacity}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">${r.feePerMonth}/mo</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'VISITORS' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm h-fit">
            <h2 className="text-lg font-bold mb-4">Generate Gate Pass</h2>
            <form onSubmit={handleIssuePass} className="space-y-4">
              <Input placeholder="Student ID" value={newVisitor.studentId} onChange={e => setNewVisitor({...newVisitor, studentId: e.target.value})} required />
              <Input placeholder="Visitor Name" value={newVisitor.visitorName} onChange={e => setNewVisitor({...newVisitor, visitorName: e.target.value})} required />
              <Input placeholder="Relation (e.g. Guardian)" value={newVisitor.relation} onChange={e => setNewVisitor({...newVisitor, relation: e.target.value})} required />
              <Input placeholder="Reason" value={newVisitor.reason} onChange={e => setNewVisitor({...newVisitor, reason: e.target.value})} />
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">Issue Pass</Button>
            </form>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b font-semibold bg-gray-50">Active & Recent Visitors</div>
            <table className="w-full text-sm text-left">
              <thead className="bg-white text-gray-700 border-b">
                <tr>
                  <th className="px-4 py-3">Visitor</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Time In</th>
                  <th className="px-4 py-3">Time Out</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map(v => (
                  <tr key={v.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{v.visitorName}</div>
                      <div className="text-xs text-muted-foreground">{v.relation}</div>
                    </td>
                    <td className="px-4 py-3">
                      {v.student?.user?.firstName} {v.student?.user?.lastName}
                    </td>
                    <td className="px-4 py-3">{new Date(v.checkInTime).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : '--'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {v.status === 'ACTIVE' ? (
                        <Button size="sm" onClick={() => handleCheckoutVisitor(v.id)} variant="outline">
                          Checkout
                        </Button>
                      ) : (
                        <span className="text-emerald-600 font-bold flex justify-end items-center gap-1">
                          <Check className="w-4 h-4" /> Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'MY_ROOM' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {myRoom ? (
            <div className="bg-white p-8 rounded-xl border shadow-sm text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Room {myRoom.room?.roomNo}</h2>
              <p className="text-xl text-muted-foreground">{myRoom.room?.hostel?.name}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t max-w-md mx-auto">
                <div>
                  <p className="text-sm text-muted-foreground">Hostel Type</p>
                  <p className="font-semibold">{myRoom.room?.hostel?.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Warden</p>
                  <p className="font-semibold">{myRoom.room?.hostel?.wardenName}</p>
                  <p className="text-xs text-muted-foreground">{myRoom.room?.hostel?.wardenPhone}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border shadow-sm text-center">
              <Building className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold text-foreground">No Room Allocated</h2>
              <p className="text-muted-foreground mt-2">You have not been assigned to a hostel room. Please contact administration.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
