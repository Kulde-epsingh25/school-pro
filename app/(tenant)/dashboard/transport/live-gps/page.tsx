"use client";

import React, { useState } from "react";
import { 
    Bus, 
    MapPin, 
    Navigation, 
    ShieldCheck, 
    Phone, 
    Clock, 
    AlertTriangle, 
    Zap,
    Compass,
    Radio
} from "lucide-react";

interface FleetVehicle {
    id: string;
    busNumber: string;
    routeName: string;
    driverName: string;
    driverPhone: string;
    currentSpeed: number; // km/h
    speedLimit: number;
    currentLocation: string;
    nextStop: string;
    etaMinutes: number;
    studentsOnboard: number;
    capacity: number;
    geofenceStatus: "Inside Safe Route" | "Route Deviation Alert";
    telemetryTimestamp: string;
}

const FLEET: FleetVehicle[] = [
    {
        id: "1",
        busNumber: "Bus #12 (KA-01-EA-9081)",
        routeName: "Route 4: Silicon Hills & Green Glen",
        driverName: "Suresh Gowda",
        driverPhone: "+91 98450 11920",
        currentSpeed: 38,
        speedLimit: 45,
        currentLocation: "Outer Ring Rd, Near Tech Park Gate 3",
        nextStop: "Greenwood Valley Main Stop",
        etaMinutes: 6,
        studentsOnboard: 32,
        capacity: 40,
        geofenceStatus: "Inside Safe Route",
        telemetryTimestamp: "10:53:40 (2s ago)"
    },
    {
        id: "2",
        busNumber: "Bus #08 (KA-01-EA-4412)",
        routeName: "Route 2: Indiranagar & Domlur",
        driverName: "Ramesh Babu",
        driverPhone: "+91 98450 33812",
        currentSpeed: 42,
        speedLimit: 45,
        currentLocation: "100ft Rd, 12th Main Crossing",
        nextStop: "Domlur Flyover Corner",
        etaMinutes: 11,
        studentsOnboard: 28,
        capacity: 35,
        geofenceStatus: "Inside Safe Route",
        telemetryTimestamp: "10:53:38 (4s ago)"
    }
];

export default function GPSTrackingPage() {
    const [fleet, setFleet] = useState<FleetVehicle[]>(FLEET);

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Navigation className="h-8 w-8 text-blue-600" />
                        Live GPS Fleet Telemetry & Parent Bus ETA
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Real-time GPS vehicle coordinates, speed-governor sensors, geofencing deviation alerts, and live arrival times.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold text-xs rounded-xl border border-blue-200 dark:border-blue-900">
                        <Radio className="h-4 w-4 animate-pulse text-blue-600" />
                        IoT Telemetry Active
                    </span>
                </div>
            </div>

            {/* Vehicle Fleet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fleet.map(b => (
                    <div key={b.id} className="bg-card border rounded-3xl p-6 shadow-sm space-y-4 hover:border-blue-300 transition">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-foreground">{b.busNumber}</h3>
                                <div className="text-xs text-muted-foreground font-medium">{b.routeName}</div>
                            </div>
                            <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold text-xs rounded-full">
                                {b.geofenceStatus}
                            </span>
                        </div>

                        {/* Live Speed & Sensor Gauge */}
                        <div className="grid grid-cols-3 gap-2 bg-muted/40 p-4 rounded-2xl text-center">
                            <div>
                                <div className="text-[11px] text-muted-foreground uppercase font-semibold">Speed Sensor</div>
                                <div className="text-xl font-extrabold text-foreground mt-0.5">
                                    {b.currentSpeed} <span className="text-xs font-normal text-muted-foreground">km/h</span>
                                </div>
                            </div>
                            <div>
                                <div className="text-[11px] text-muted-foreground uppercase font-semibold">Next Stop ETA</div>
                                <div className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-0.5">
                                    {b.etaMinutes} mins
                                </div>
                            </div>
                            <div>
                                <div className="text-[11px] text-muted-foreground uppercase font-semibold">Occupancy</div>
                                <div className="text-xl font-extrabold text-foreground mt-0.5">
                                    {b.studentsOnboard}/{b.capacity}
                                </div>
                            </div>
                        </div>

                        {/* Route Locations */}
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-foreground font-medium">
                                <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                                Current: <span className="text-muted-foreground">{b.currentLocation}</span>
                            </div>
                            <div className="flex items-center gap-2 text-foreground font-medium">
                                <Clock className="h-4 w-4 text-emerald-600 shrink-0" />
                                Upcoming: <span className="text-muted-foreground">{b.nextStop}</span>
                            </div>
                        </div>

                        {/* Driver Contact & Ping */}
                        <div className="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 text-foreground font-medium">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                Driver: {b.driverName} ({b.driverPhone})
                            </div>
                            <div className="font-mono text-[11px]">{b.telemetryTimestamp}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
