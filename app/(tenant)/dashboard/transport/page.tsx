"use client";

import React, { useState, useEffect } from "react";
import { Bus, MapPin, Users, Plus, Navigation, AlertCircle, RefreshCw } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TransportVehicle {
  id: string;
  registrationNo: string;
  capacity: number;
  driverName: string;
  driverPhone?: string;
}

interface TransportStop {
  id?: string;
  stopName: string;
  pickupTime: string;
  dropTime: string;
  feeAmount: number;
}

interface TransportRoute {
  id: string;
  name: string;
  vehicle?: TransportVehicle;
  stops?: TransportStop[];
}

export default function TransportPage() {
  const { school } = useSchoolStore();
  const user = useAuthStore(state => state.user);
  
  const [activeTab, setActiveTab] = useState<"ROUTES" | "VEHICLES" | "MY_ROUTE">("ROUTES");
  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [vehicles, setVehicles] = useState<TransportVehicle[]>([]);
  const [myRoute, setMyRoute] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [newVehicle, setNewVehicle] = useState({ registrationNo: "", capacity: 40, driverName: "", driverPhone: "" });
  
  // Route builder state
  const [showRouteBuilder, setShowRouteBuilder] = useState(false);
  const [newRoute, setNewRoute] = useState({ name: "", vehicleId: "" });
  const [stops, setStops] = useState<TransportStop[]>([{ stopName: "", pickupTime: "", dropTime: "", feeAmount: 0 }]);

  useEffect(() => {
    if (school?.id) {
      fetchVehicles();
      fetchRoutes();
      if (user?.id) fetchMyRoute();
    }
  }, [school?.id, user?.id]);

  const fetchVehicles = async () => {
    try {
      const res = await apiClient.get<TransportVehicle[]>(`/transport/vehicles?tenantId=${school?.id}`);
      if (res.ok && res.data) setVehicles(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<TransportRoute[]>(`/transport/routes?tenantId=${school?.id}`);
      if (res.ok && res.data) {
        setRoutes(Array.isArray(res.data) ? res.data : []);
      } else {
        throw new Error(res.error || "Unable to query transit routes");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load bus routes.");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRoute = async () => {
    try {
      const res = await apiClient.get<any>(`/transport/my-route?tenantId=${school?.id}&studentId=${user?.id}`);
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

  const handleUpdateStop = (index: number, field: keyof TransportStop, value: any) => {
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Transport Management</h1>
          <p className="text-muted-foreground mt-2">Manage bus fleet, plan routes, and track allocation.</p>
        </div>
      </div>

      <div className="flex border-b">
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'ROUTES' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('ROUTES')}
        >
          Routes & Stops
        </button>
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'VEHICLES' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('VEHICLES')}
        >
          Fleet (Vehicles)
        </button>
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'MY_ROUTE' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('MY_ROUTE')}
        >
          My Route / Tracking
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Fleet Telemetry Notice</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchRoutes} className="gap-2 h-8 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}

      {activeTab === 'VEHICLES' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm md:col-span-1 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Add Vehicle
            </h2>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <Input placeholder="Registration No. (e.g. MH-12-1234)" value={newVehicle.registrationNo} onChange={e => setNewVehicle({...newVehicle, registrationNo: e.target.value})} required />
              <Input type="number" placeholder="Capacity" value={newVehicle.capacity} onChange={e => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value) || 40})} required />
              <Input placeholder="Driver Name" value={newVehicle.driverName} onChange={e => setNewVehicle({...newVehicle, driverName: e.target.value})} required />
              <Input placeholder="Driver Phone" value={newVehicle.driverPhone} onChange={e => setNewVehicle({...newVehicle, driverPhone: e.target.value})} />
              <Button type="submit" className="w-full">Save Vehicle</Button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-4">
            {vehicles.map(v => (
              <div key={v.id} className="bg-white p-4 rounded-xl border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{v.registrationNo}</h3>
                    <p className="text-sm text-muted-foreground">Driver: {v.driverName} ({v.driverPhone || "No phone"})</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold bg-muted px-2.5 py-1 rounded text-foreground">
                    Capacity: {v.capacity}
                  </span>
                </div>
              </div>
            ))}
            {vehicles.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No vehicles registered in fleet.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ROUTES' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setShowRouteBuilder(!showRouteBuilder)}>
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
                      <Input type="number" placeholder="Fee ($)" value={stop.feeAmount} onChange={e => handleUpdateStop(index, 'feeAmount', parseFloat(e.target.value) || 0)} />
                    </div>
                  ))}
                </div>

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">Save Complete Route</Button>
              </form>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {routes.map(r => (
              <div key={r.id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                  <h3 className="font-bold text-lg">{r.name}</h3>
                  <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    Bus {r.vehicle?.registrationNo || "Assigned"}
                  </span>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    {(r.stops || []).map((stop: TransportStop, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <span className="font-medium text-foreground">{stop.stopName}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pickup: {stop.pickupTime} | Drop: {stop.dropTime}
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
                <p className="text-muted-foreground">Your Stop: <strong className="text-foreground">{myRoute.stop?.stopName}</strong></p>
                <div className="flex justify-center gap-8 mt-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Pickup Time</p>
                    <p className="text-xl font-bold">{myRoute.stop?.pickupTime} AM</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Drop Time</p>
                    <p className="text-xl font-bold">{myRoute.stop?.dropTime} PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicle</p>
                    <p className="text-xl font-bold">{myRoute.route?.vehicle?.registrationNo}</p>
                  </div>
                </div>
              </div>

              {/* Mock Live Tracking */}
              <div className="bg-slate-900 rounded-xl border shadow-sm overflow-hidden h-[400px] relative flex flex-col items-center justify-center text-white">
                <Navigation className="w-16 h-16 text-primary mb-4 animate-pulse" />
                <h3 className="text-xl font-bold">Live Tracking Simulator</h3>
                <p className="text-slate-400 mt-2">Bus is currently near {myRoute.stop?.stopName}</p>
                <p className="text-xs text-slate-500 mt-4 font-mono">LAT: 34.0522 N | LNG: 118.2437 W</p>
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                  <span className="text-xs font-bold text-emerald-500">LIVE</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl border shadow-sm text-center">
              <Bus className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold text-foreground">No Transport Allocated</h2>
              <p className="text-muted-foreground mt-2">You have not been assigned to a bus route yet. Contact administration.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
