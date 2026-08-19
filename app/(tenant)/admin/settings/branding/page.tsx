"use client";

import React, { useState } from "react";
import { 
    Palette, 
    Globe, 
    CheckCircle2, 
    Sparkles, 
    Moon, 
    Sun, 
    Layout, 
    Type, 
    Sliders,
    Building2,
    Eye
} from "lucide-react";

interface ThemePreset {
    id: string;
    name: string;
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    previewClass: string;
}

const THEME_PRESETS: ThemePreset[] = [
    {
        id: "classic-navy",
        name: "Oxford Navy & Crimson",
        primaryColor: "#1e3a8a",
        accentColor: "#dc2626",
        fontFamily: "Inter, sans-serif",
        previewClass: "from-blue-900 to-indigo-950"
    },
    {
        id: "emerald-slate",
        name: "Emerald Green & Slate",
        primaryColor: "#059669",
        accentColor: "#d97706",
        fontFamily: "Outfit, sans-serif",
        previewClass: "from-emerald-900 to-teal-950"
    },
    {
        id: "royal-purple",
        name: "Imperial Violet & Gold",
        primaryColor: "#7c3aed",
        accentColor: "#f59e0b",
        fontFamily: "Plus Jakarta Sans, sans-serif",
        previewClass: "from-purple-900 to-indigo-950"
    },
    {
        id: "midnight-cyber",
        name: "Midnight OLED & Cyan",
        primaryColor: "#06b6d4",
        accentColor: "#8b5cf6",
        fontFamily: "Geist, monospace",
        previewClass: "from-zinc-950 to-neutral-900"
    }
];

export default function TenantBrandingPage() {
    const [selectedTheme, setSelectedTheme] = useState("classic-navy");
    const [primaryLanguage, setPrimaryLanguage] = useState("en");
    const [enableRTL, setEnableRTL] = useState(false);
    const [schoolTagline, setSchoolTagline] = useState("Empowering Leaders of Tomorrow through Holistic Excellence");

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Palette className="h-8 w-8 text-primary" />
                        School Branding, Multi-Language (i18n) & Theme Customizer
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Tailor your institution's color tokens, typography, header styling, and multilingual localization settings.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition shadow-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Save Brand Preferences
                    </button>
                </div>
            </div>

            {/* Language & Regionalization */}
            <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Globe className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base text-foreground">Localization & Multi-Language Preferences</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Default Portal Language</label>
                        <select
                            value={primaryLanguage}
                            onChange={e => setPrimaryLanguage(e.target.value)}
                            className="w-full px-3 py-2 bg-background border text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="en">English (US / UK / Global)</option>
                            <option value="hi">हिन्दी (Hindi)</option>
                            <option value="ar">العربية (Arabic - RTL)</option>
                            <option value="es">Español (Spanish)</option>
                            <option value="fr">Français (French)</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Date Format</label>
                        <select className="w-full px-3 py-2 bg-background border text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 19/08/2026)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 08/19/2026)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">Right-to-Left (RTL) Layout</label>
                        <div className="pt-2">
                            <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={enableRTL} 
                                    onChange={e => setEnableRTL(e.target.checked)} 
                                    className="rounded" 
                                />
                                Enable automatic RTL layout flipping
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curated Color Themes */}
            <div className="bg-card border rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-bold text-base text-foreground">Institution Color Palettes & Tokens</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {THEME_PRESETS.map(preset => (
                        <div
                            key={preset.id}
                            onClick={() => setSelectedTheme(preset.id)}
                            className={`border-2 rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between space-y-4 ${
                                selectedTheme === preset.id
                                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                    : "hover:border-muted-foreground/40"
                            }`}
                        >
                            <div className="space-y-2">
                                <div className={`h-16 rounded-xl bg-gradient-to-r ${preset.previewClass} shadow-inner flex items-center justify-center text-white text-xs font-bold`}>
                                    Live Preview
                                </div>
                                <h4 className="font-bold text-sm text-foreground">{preset.name}</h4>
                                <div className="text-[11px] text-muted-foreground font-mono">{preset.fontFamily}</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 rounded-full border shadow-sm" style={{ backgroundColor: preset.primaryColor }} />
                                <div className="h-4 w-4 rounded-full border shadow-sm" style={{ backgroundColor: preset.accentColor }} />
                                <span className="text-[11px] text-muted-foreground ml-auto">
                                    {selectedTheme === preset.id ? "✓ Active" : "Select"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
