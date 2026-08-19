"use client";

import React, { useState } from "react";
import { 
    Gift, 
    Calendar, 
    Users, 
    Briefcase, 
    Search, 
    Award, 
    Heart, 
    ExternalLink 
} from "lucide-react";

interface AlumniMember {
    id: string;
    name: string;
    gradYear: number;
    company: string;
    role: string;
    location: string;
    contributions: number;
}

const ALUMNI_LIST: AlumniMember[] = [
    { id: "1", name: "Vikram Malhotra", gradYear: 2018, company: "Google", role: "Staff Software Engineer", location: "San Francisco, USA", contributions: 5000 },
    { id: "2", name: "Pooja Hegde", gradYear: 2015, company: "McKinsey & Company", role: "Associate Partner", location: "London, UK", contributions: 12000 },
    { id: "3", name: "David Kim", gradYear: 2020, company: "Stanford Health Care", role: "Resident Physician", location: "Palo Alto, USA", contributions: 2500 },
    { id: "4", name: "Sneha Reddy", gradYear: 2012, company: "EcoEnergy Innovations", role: "Founder & CEO", location: "Bengaluru, India", contributions: 25000 },
];

export default function AlumniPortalPage() {
    const [search, setSearch] = useState("");

    const filtered = ALUMNI_LIST.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase()) || 
        a.company.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-3">
                    <span className="bg-white/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                        School Pro Alumni Network
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight">
                        Connecting Graduates Across the Globe
                    </h1>
                    <p className="text-indigo-100 text-sm">
                        Network with fellow alumni, mentor current students, join reunions, and support our institution's scholarship endowment funds.
                    </p>
                    <div className="flex gap-3 pt-2">
                        <button className="px-4 py-2 bg-white text-indigo-900 font-semibold rounded-xl text-sm hover:bg-indigo-50 transition shadow">
                            Make a Contribution
                        </button>
                        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl text-sm transition">
                            Upcoming Reunions
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-xl">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-foreground">3,850+</div>
                        <div className="text-xs text-muted-foreground">Registered Alumni</div>
                    </div>
                </div>
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950/50 text-purple-600 rounded-xl">
                        <Heart className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-foreground">$142,500</div>
                        <div className="text-xs text-muted-foreground">Scholarship Endowment</div>
                    </div>
                </div>
                <div className="bg-card border rounded-2xl p-5 flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-foreground">12</div>
                        <div className="text-xs text-muted-foreground">Annual Chapters & Events</div>
                    </div>
                </div>
            </div>

            {/* Alumni Directory */}
            <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        <Award className="h-5 w-5 text-indigo-600" />
                        Alumni Directory
                    </h3>
                    <div className="relative sm:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, company..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-background text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map(alumnus => (
                        <div key={alumnus.id} className="border rounded-xl p-4 flex items-start justify-between hover:border-indigo-300 transition">
                            <div className="space-y-1">
                                <h4 className="font-bold text-sm text-foreground">{alumnus.name}</h4>
                                <div className="text-xs font-semibold text-indigo-600">Class of {alumnus.gradYear}</div>
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                    {alumnus.role} at {alumnus.company}
                                </div>
                                <div className="text-xs text-muted-foreground">{alumnus.location}</div>
                            </div>
                            <div className="text-right space-y-2">
                                <span className="text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full inline-block">
                                    Donor (${alumnus.contributions})
                                </span>
                                <div>
                                    <button className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1 justify-end">
                                        Connect <ExternalLink className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
