"use client";

import React, { useState, useEffect } from "react";
import { Bus, MapPin, Users, Plus, Navigation } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TransportPage() {
  const { school } = useSchoolStore();
  const user = useAuthStore(state => state.user);
  
  const [activeTab, setActiveTab] = useState<"ROUTES" | "VEHICLES" | "MY_ROUTE">("ROUTES");
  const [routes, setRoutes] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [myRoute, setMyRoute] = useState<any>(null);

  // Form states
  const [newVehicle, setNewVehicle] = useState({ registrationNo: "", capacity: 40, driverName: "", driverPhone: "" });
  
  // Route builder state
  const [showRouteBuilder, setShowRouteBuilder] = useState(false);
  const [newRoute, setNewRoute] = useState({ name: "", vehicleId: "" });
  const [stops, setStops] = useState([{ stopName: "", pickupTime: "", dropTime: "", feeAmount: 0 }]);

  useEffect(() => {
    if (school?.id) {
      fetchVehicles();
      fetchRoutes();
      if (user?.id) fetchMyRoute();
    }
  }, [school?.id, user?.id]);

  const fetchVehicles = async () => {
    try {
      const res = await apiClient.get<any[]>(`/transport/vehicles?tenantId=${school?.id}`);
      if (res.ok && res.data) setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await apiClient.get<any[]>(`/transport/routes?tenantId=${school?.id}`);
      if (res.ok && res.data) setRoutes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyRoute = async () => {
    try {
      const res = await apiClient.get<any>(`/transport/my-route?tenantId=${school?.id}&studentId=${user?.id}`); // Assuming parent's child is resolved, or user is student
      if (res.ok && res.data) setMyRoute(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/transport/vehicles?tenantId=${school?.id}`, newVehicle);
      setNewVehicle({ registrationNo: "", capacity: 40, driverName: "", driverPhone: "" });
      fetchVehicles();
      alert("Vehicle added");
    } catch (err) {
      alert("Failed to add vehicle");
    }
  };

  const handleAddStop = () => {
    setStops([...stops, { stopName: "", pickupTime: "", dropTime: "", feeAmount: 0 }]);
  };

  const handleUpdateStop = (index: number, field: string, value: any) => {
    const updated = [...stops];
    (updated[index] as any)[field] = value;
    setStops(updated);
  };

  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/transport/routes?tenantId=${school?.id}`, {
        ...newRoute,
        stops
      });
      setShowRouteBuilder(false);
      setNewRoute({ name: "", vehicleId: "" });
      setStops([{ stopName: "", pickupTime: "", dropTime: "", feeAmount: 0 }]);
      fetchRoutes();
      alert("Route saved");
    } catch (err) {
      alert("Failed to save route");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Transport Management</h1>
          <p className="text-gray-500 mt-2">Manage bus fleet, plan routes, and track allocation.</p>
        </div>
      </div>

      <div className="flex border-b">
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'ROUTES' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('ROUTES')}
        >
          Routes & Stops
        </button>
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'VEHICLES' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('VEHICLES')}
        >
          Fleet (Vehicles)
        </button>
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'MY_ROUTE' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('MY_ROUTE')}
        >
          My Route / Tracking
        </button>
      </div>

      {activeTab === 'VEHICLES' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm md:col-span-1 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Add Vehicle
            </h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <Input placeholder="Registration No. (e.g. MH-12-1234)" value={newVehicle.registrationNo} onChange={e => setNewVehicle({...newVehicle, registrationNo: e.target.value})} required />
              <Input type="number" placeholder="Capacity" value={newVehicle.capacity} onChange={e => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value)})} required />
              <Input placeholder="Driver Name" value={newVehicle.driverName} onChange={e => setNewVehicle({...newVehicle, driverName: e.target.value})} required />
              <Input placeholder="Driver Phone" value={newVehicle.driverPhone} onChange={e => setNewVehicle({...newVehicle, driverPhone: e.target.value})} />
              <Button type="submit" className="w-full bg-blue-600">Save Vehicle</Button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-4">
            {vehicles.map(v => (
              <div key={v.id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{v.registrationNo}</h3>
                    <p className="text-sm text-gray-500">Driver: {v.driverName} ({v.driverPhone})</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">
                    Capacity: {v.capacity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ROUTES' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowRouteBuilder(!showRouteBuilder)} className="bg-blue-600">
              {showRouteBuilder ? "Cancel" : "Create New Route"}
            </Button>
          </div>

          {showRouteBuilder && (
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold mb-4">Route Builder</h2>
              <form onSubmit={handleSaveRoute} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold block mb-1">Route Name</label>
                    <Input placeholder="e.g. North City Loop" value={newRoute.name} onChange={e => setNewRoute({...newRoute, name: e.target.value})} required />
                  </div>
                  <div>
                    <label className="text-sm font-semibold block mb-1">Assign Vehicle</label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newRoute.vehicleId}
                      onChange={e => setNewRoute({...newRoute, vehicleId: e.target.value})}
                      required
                    >
                      <option value="">Select a vehicle...</option>
                      {vehicles.map(v => (
                        <option key={v.id} value={v.id}>{v.registrationNo} (Cap: {v.capacity})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-4 h-4" /> Stops</h3>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddStop}>Add Stop</Button>
                  </div>
                  {stops.map((stop, index) => (
                    <div key={index} className="flex gap-2 items-center bg-gray-50 p-3 rounded-lg border">
                      <div className="font-bold text-gray-400 w-6">{index + 1}.</div>
                      <Input placeholder="Stop Name" value={stop.stopName} onChange={e => handleUpdateStop(index, 'stopName', e.target.value)} required className="flex-2" />
                      <Input type="time" placeholder="Pickup" value={stop.pickupTime} onChange={e => handleUpdateStop(index, 'pickupTime', e.target.value)} required />
                      <Input type="time" placeholder="Drop" value={stop.dropTime} onChange={e => handleUpdateStop(index, 'dropTime', e.target.value)} required />
                      <Input type="number" placeholder="Fee ($)" value={stop.feeAmount} onChange={e => handleUpdateStop(index, 'feeAmount', parseFloat(e.target.value))} />
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Save Complete Route</Button>
              </form>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {routes.map(r => (
              <div key={r.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-lg">{r.name}</h3>
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Bus {r.vehicle?.registrationNo}
                  </span>
                </div>
                <div className="p-4">
                  <div className="space-y-3 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {r.stops?.map((stop: any, idx: number) => (
                      <div key={stop.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border shadow-sm bg-white">
                          <div className="flex items-center justify-between space-x-2 mb-1">
                            <div className="font-bold text-slate-900">{stop.stopName}</div>
                            <time className="font-caveat font-medium text-indigo-500">{stop.pickupTime} AM</time>
                          </div>
                          <div className="text-xs text-slate-500">Drop: {stop.dropTime} PM</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'MY_ROUTE' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {myRoute ? (
            <>
              <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
                <h2 className="text-2xl font-bold mb-2">You are assigned to: {myRoute.route?.name}</h2>
                <p className="text-gray-500">Your Stop: <strong className="text-gray-900">{myRoute.stop?.stopName}</strong></p>
                <div className="flex justify-center gap-8 mt-6">
                  <div>
                    <p className="text-sm text-gray-500">Pickup Time</p>
                    <p className="text-xl font-bold">{myRoute.stop?.pickupTime} AM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Drop Time</p>
                    <p className="text-xl font-bold">{myRoute.stop?.dropTime} PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vehicle</p>
                    <p className="text-xl font-bold">{myRoute.route?.vehicle?.registrationNo}</p>
                  </div>
                </div>
              </div>

              {/* Mock Live Tracking */}
              <div className="bg-slate-900 rounded-xl border shadow-sm overflow-hidden h-[400px] relative flex flex-col items-center justify-center text-white">
                <Navigation className="w-16 h-16 text-blue-400 mb-4 animate-pulse" />
                <h3 className="text-xl font-bold">Live Tracking Simulator</h3>
                <p className="text-slate-400 mt-2">Bus is currently near {myRoute.stop?.stopName}</p>
                <p className="text-xs text-slate-500 mt-4 font-mono">LAT: 34.0522 N | LNG: 118.2437 W</p>
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-ping"></div>
                  <span className="text-xs font-bold text-green-500">LIVE</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl border shadow-sm text-center">
              <Bus className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-gray-700">No Transport Allocated</h2>
              <p className="text-gray-500 mt-2">You have not been assigned to a bus route yet. Contact administration.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
