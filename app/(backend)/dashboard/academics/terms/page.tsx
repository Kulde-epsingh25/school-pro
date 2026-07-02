"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AcademicPeriodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActiveToggle, setIsActiveToggle] = useState(true);
  
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [termName, setTermName] = useState("Term 1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchTerms = async () => {
    try {
      const res = await fetch("https://school-pro-api-6mxq.onrender.com/academics/terms");
      const data = await res.json();
      setTerms(data);
    } catch (error) {
      console.error("Failed to fetch terms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleAddPeriod = async () => {
    if (!startDate || !endDate) {
      alert("Please enter start and end dates");
      return;
    }

    try {
      await fetch("https://school-pro-api-6mxq.onrender.com/academics/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: termName,
          year: year,
          startDate: startDate,
          endDate: endDate,
          isActive: isActiveToggle
        })
      });
      setIsModalOpen(false);
      fetchTerms(); // Refresh the list
    } catch (error) {
      console.error("Failed to add term:", error);
    }
  };

  // Group terms by year for the UI
  const groupedTerms = terms.reduce((acc: any, term: any) => {
    if (!acc[term.year]) acc[term.year] = [];
    acc[term.year].push(term);
    return acc;
  }, {});

  return (
    <div className="flex-1 space-y-8 bg-white min-h-screen relative p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Academic Periods</h1>
        <Button 
          className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium shadow-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Period
        </Button>
      </div>

      {/* Data Tables grouped by Year */}
      <div className="space-y-12">
        {loading ? (
          <p className="text-gray-500 font-semibold">Loading terms...</p>
        ) : Object.keys(groupedTerms).length === 0 ? (
          <p className="text-gray-500 font-semibold italic">No academic periods found. Click "Add New Period" to create one.</p>
        ) : (
          Object.entries(groupedTerms).sort(([a],[b]) => Number(b) - Number(a)).map(([year, periods]: [string, any]) => (
            <div key={year} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">{year}</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400">
                      <th className="py-4 px-4 font-semibold w-[20%]">Term</th>
                      <th className="py-4 px-4 font-semibold w-[30%]">Start Date</th>
                      <th className="py-4 px-4 font-semibold w-[30%]">End Date</th>
                      <th className="py-4 px-4 font-semibold w-[20%]">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900 font-semibold">
                    {periods.map((period: any) => (
                      <tr key={period.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-5 px-4 text-gray-600">{period.name}</td>
                        <td className="py-5 px-4 text-gray-600">{new Date(period.startDate).toDateString()}</td>
                        <td className="py-5 px-4 text-gray-600">{new Date(period.endDate).toDateString()}</td>
                        <td className="py-5 px-4">
                          {period.isActive ? (
                            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-emerald-100 text-emerald-700">
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-gray-100 text-gray-500">
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD NEW PERIOD MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="p-6 pb-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 tracking-tight">Add New Period</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 rounded-full hover:bg-gray-100" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 pt-0 space-y-6">
              
              {/* Year & Term Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Year</label>
                  <Input 
                    type="number" 
                    value={year} 
                    onChange={(e) => setYear(e.target.value)}
                    className="h-11 border-gray-200 focus-visible:ring-blue-500 font-semibold text-gray-900" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Term Name</label>
                  <Input 
                    type="text" 
                    value={termName} 
                    onChange={(e) => setTermName(e.target.value)}
                    className="h-11 border-gray-200 focus-visible:ring-blue-500 font-semibold text-gray-900" 
                  />
                </div>
              </div>
              
              {/* Dates Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Start Date</label>
                  <div className="relative">
                    <Input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="h-11 border-gray-200 focus-visible:ring-blue-500 text-gray-500 pl-4 pr-10" 
                    />
                    <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">End Date</label>
                  <div className="relative">
                    <Input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="h-11 border-gray-200 focus-visible:ring-blue-500 text-gray-500 pl-4 pr-10" 
                    />
                    <CalendarIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              {/* Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => setIsActiveToggle(!isActiveToggle)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isActiveToggle ? 'bg-[#2563EB]' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActiveToggle ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
                <span className="text-sm font-bold text-gray-800">Set as active period</span>
              </div>

              {/* Action Button */}
              <Button 
                className="w-full h-12 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base mt-4 shadow-sm" 
                onClick={handleAddPeriod}
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Period
              </Button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
