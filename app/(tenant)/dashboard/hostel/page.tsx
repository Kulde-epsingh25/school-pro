"use client";

import React, { useState, useEffect } from "react";
import { Building, Bed, Users, UserCheck, Plus, Check } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HostelPage() {
  const { school } = useSchoolStore();
  const user = useAuthStore(state => state.user);
  
  const [activeTab, setActiveTab] = useState<"HOSTELS" | "VISITORS" | "MY_ROOM">("HOSTELS");
  const [hostels, setHostels] = useState<any[]>([]);
  const [visitors, setVisitors] = useState<any[]>([]);
  const [myRoom, setMyRoom] = useState<any>(null);

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
      const res = await apiClient.get<any[]>(`/hostel/all?tenantId=${school?.id}`);
      if (res.ok && res.data) setHostels(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVisitors = async () => {
    try {
      const res = await apiClient.get<any[]>(`/hostel/visitors?tenantId=${school?.id}`);
      if (res.ok && res.data) setVisitors(res.data);
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hostel Management</h1>
          <p className="text-gray-500 mt-2">Manage properties, allocate rooms, and track visitors.</p>
        </div>
      </div>

      <div className="flex border-b">
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'HOSTELS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('HOSTELS')}
        >
          Hostels & Rooms
        </button>
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'VISITORS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('VISITORS')}
        >
          Visitor Logs (Gate Pass)
        </button>
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'MY_ROOM' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('MY_ROOM')}
        >
          My Room
        </button>
      </div>

      {activeTab === 'HOSTELS' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            {/* Create Hostel */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" /> New Hostel
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
                <Button type="submit" className="w-full bg-blue-600">Create</Button>
              </form>
            </div>

            {/* Allocate Student */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" /> Allocate Room
              </h2>
              <form onSubmit={handleAllocate} className="space-y-4">
                <Input placeholder="Student ID" value={allocationData.studentId} onChange={e => setAllocationData({...allocationData, studentId: e.target.value})} required />
                <Input placeholder="Room ID" value={allocationData.roomId} onChange={e => setAllocationData({...allocationData, roomId: e.target.value})} required />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Assign Room</Button>
              </form>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            {hostels.map(h => (
              <div key={h.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{h.name} ({h.type})</h3>
                    <p className="text-xs text-gray-500">Warden: {h.wardenName} | {h.wardenPhone}</p>
                  </div>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {h.rooms?.length} Rooms
                  </span>
                </div>
                
                <div className="p-4">
                  {/* Quick Add Room Form inline */}
                  <form onSubmit={handleAddRoom} className="flex gap-2 mb-4 bg-gray-50 p-2 rounded border">
                    <Input placeholder="Room No" value={newRoom.roomNo} onChange={e => setNewRoom({...newRoom, hostelId: h.id, roomNo: e.target.value})} required className="w-24" />
                    <Input type="number" placeholder="Cap" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, hostelId: h.id, capacity: parseInt(e.target.value)})} required className="w-20" />
                    <Input type="number" placeholder="Fee/mo ($)" value={newRoom.feePerMonth} onChange={e => setNewRoom({...newRoom, hostelId: h.id, feePerMonth: parseFloat(e.target.value)})} className="w-28" />
                    <Button type="submit" size="sm" className="bg-blue-600"><Plus className="w-4 h-4" /></Button>
                  </form>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {h.rooms?.map((r: any) => (
                      <div key={r.id} className={`p-3 rounded border ${r.currentOccupancy >= r.capacity ? 'bg-red-50 border-red-200' : 'bg-white'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold">{r.roomNo}</span>
                          <span className="text-[10px] text-gray-400">ID: {r.id.slice(-4)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-3 h-3" />
                          <span className={r.currentOccupancy >= r.capacity ? 'text-red-600 font-bold' : 'text-gray-600'}>
                            {r.currentOccupancy} / {r.capacity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">${r.feePerMonth}/mo</div>
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
              <Input placeholder="Relation (e.g. Father)" value={newVisitor.relation} onChange={e => setNewVisitor({...newVisitor, relation: e.target.value})} required />
              <Input placeholder="Reason" value={newVisitor.reason} onChange={e => setNewVisitor({...newVisitor, reason: e.target.value})} />
              <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">Issue Pass</Button>
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
                      <div className="text-xs text-gray-500">{v.relation}</div>
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
                        <Button size="sm" onClick={() => handleCheckoutVisitor(v.id)} className="bg-slate-800">
                          Checkout
                        </Button>
                      ) : (
                        <span className="text-green-600 font-bold flex justify-end items-center gap-1">
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
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Room {myRoom.room?.roomNo}</h2>
              <p className="text-xl text-gray-600">{myRoom.room?.hostel?.name}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t max-w-md mx-auto">
                <div>
                  <p className="text-sm text-gray-500">Hostel Type</p>
                  <p className="font-semibold">{myRoom.room?.hostel?.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Warden</p>
                  <p className="font-semibold">{myRoom.room?.hostel?.wardenName}</p>
                  <p className="text-xs text-gray-400">{myRoom.room?.hostel?.wardenPhone}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border shadow-sm text-center">
              <Building className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-700">No Room Allocated</h2>
              <p className="text-gray-500 mt-2">You have not been assigned to a hostel room. Please contact administration.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
