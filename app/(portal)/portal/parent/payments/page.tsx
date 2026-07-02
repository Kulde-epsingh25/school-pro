"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PaymentsPage() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "payments">("pending");
  const [isPrnModalOpen, setIsPrnModalOpen] = useState(false);
  const [currentPrn, setCurrentPrn] = useState("");

  const [children, setChildren] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demonstration, we'd normally fetch the logged-in parent's students
    // fetch("https://school-pro-api-6mxq.onrender.com/parents/me/students").then(...)
    // Since we cleared the DB, let's just show empty states gracefully until data is added
    setChildren([]);
    setLoading(false);
  }, []);

  const fetchPayments = async (studentId: string) => {
    try {
      const res = await fetch(`https://school-pro-api-6mxq.onrender.com/finance/payments/student/${studentId}`);
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
  };

  useEffect(() => {
    if (selectedChildId) {
      fetchPayments(selectedChildId);
    }
  }, [selectedChildId]);

  const handlePayFees = async () => {
    if (!selectedChildId) return;

    try {
      // Create a pending payment
      const res = await fetch("https://school-pro-api-6mxq.onrender.com/finance/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedChildId,
          amount: 3000, // mock amount for now
          status: "PENDING",
          description: "Term 1 Fees"
        })
      });
      const data = await res.json();
      setCurrentPrn(data.prn);
      setIsPrnModalOpen(true);
      fetchPayments(selectedChildId);
    } catch (error) {
      console.error("Failed to generate payment", error);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-white relative">
      
      {/* Left Pane - My Children */}
      <div className="w-[300px] border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <Users className="w-5 h-5 text-gray-600" />
            My Children
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          {loading ? (
            <p className="text-gray-500 text-sm">Loading children...</p>
          ) : children.length === 0 ? (
            <p className="text-gray-400 text-sm italic p-2">No children found in database.</p>
          ) : (
            children.map((child: any) => (
              <div 
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedChildId === child.id 
                    ? 'bg-blue-50/50 border border-blue-100' 
                    : 'hover:bg-gray-100/50 border border-transparent'
                }`}
              >
                <Avatar className="h-10 w-10 border border-gray-100 bg-white">
                  <AvatarImage src={child.imageUrl} alt={child.firstName} />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-xs">
                    {child.firstName?.[0]}{child.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-gray-900">{child.firstName} {child.lastName}</span>
                  <span className="text-xs font-semibold text-gray-400">{child.classId}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Pane - Dynamic Content */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-white p-10 relative">
        {!selectedChildId ? (
          <div className="h-full flex flex-col items-center justify-center">
            <p className="text-lg font-medium text-gray-500 mb-2">Select a Student to see Payments</p>
            <p className="text-sm text-gray-400">If the list is empty, you need to create Students in the Admin panel first!</p>
          </div>
        ) : (
          <div className="max-w-4xl animate-in fade-in duration-300">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-gray-500 font-semibold mb-6">Student ID: {selectedChildId}</h2>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payments 2025</h1>
                
                {activeTab === "pending" ? (
                  <Button 
                    className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium shadow-sm"
                    onClick={handlePayFees}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Pay Fees
                  </Button>
                ) : (
                  <Button className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium shadow-sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Payment
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 mb-8">
              <button 
                onClick={() => setActiveTab("pending")}
                className={`flex-1 pb-4 text-sm font-bold transition-colors ${
                  activeTab === "pending" 
                    ? "text-gray-900 border-b-2 border-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Pending Payments
              </button>
              <button 
                onClick={() => setActiveTab("payments")}
                className={`flex-1 pb-4 text-sm font-bold transition-colors ${
                  activeTab === "payments" 
                    ? "text-gray-900 border-b-2 border-gray-900" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Payments History
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "pending" ? (
              /* Pending Fees Card - Normally fetched from Fees API */
              <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 bg-white border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800">Pending Fees for Term 1-2025</h3>
                </div>
                
                <div className="bg-gray-50/50">
                  <div className="grid grid-cols-2 p-4 px-6 text-sm font-bold text-gray-500 border-b border-gray-100">
                    <div>Fee Title</div>
                    <div className="text-right">Amount</div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    <div className="grid grid-cols-2 p-5 px-6 items-center bg-white hover:bg-gray-50/50 transition-colors">
                      <div className="font-semibold text-gray-700">Functional Fees</div>
                      <div className="text-right font-bold text-gray-900">$1000.00</div>
                    </div>
                    <div className="grid grid-cols-2 p-5 px-6 items-center bg-white hover:bg-gray-50/50 transition-colors">
                      <div className="font-semibold text-gray-700">Tuition</div>
                      <div className="text-right font-bold text-gray-900">$2000.00</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 bg-white flex justify-end">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-500 mb-1">Total Amount</div>
                    <div className="text-3xl font-bold text-gray-900 tracking-tight">$3000.00</div>
                  </div>
                </div>
              </div>
            ) : (
              /* Payments Progress Cards - Fetched from API */
              <div className="space-y-6">
                {payments.length === 0 ? (
                  <p className="text-gray-500 italic">No payments recorded for this student.</p>
                ) : (
                  payments.map(payment => (
                    <div key={payment.id} className="border border-gray-100 rounded-xl p-6 shadow-sm bg-white animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{payment.prn}</h3>
                          <p className="text-sm text-gray-400 font-semibold mt-1">Status: {payment.status}</p>
                        </div>
                        <div className="text-lg font-semibold text-gray-700">
                          {payment.description || "General Fee"}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900">UGX {payment.amount}</span>
                          <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 font-bold hover:bg-gray-50">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-gray-600">Payment Progress({payment.status === "PENDING" ? "0" : "100"}%)</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#2563EB] rounded-full" style={{ width: payment.status === "PENDING" ? '0%' : '100%' }}></div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        )}
      </div>

      {/* PRN MODAL OVERLAY */}
      {isPrnModalOpen && (
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 pb-2 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Payment Successful</h3>
                <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded inline-block mt-2">
                  Take the PRN to your bank to complete the payment
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 rounded-full hover:bg-gray-100" onClick={() => setIsPrnModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 pt-4">
              <div className="border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
                <span className="font-bold text-gray-800 text-lg tracking-wider break-all">
                  PRN : {currentPrn}
                </span>
                <Button className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold px-8 shadow-sm">
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
