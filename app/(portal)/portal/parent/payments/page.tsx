"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users, Eye, X, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/authStore";

interface StudentChild {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  classId?: string;
}

interface PaymentRecord {
  id: string;
  prn: string;
  amount: number;
  status: string;
  description?: string;
  createdAt?: string;
}

export default function PaymentsPage() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "payments">("pending");
  const [isPrnModalOpen, setIsPrnModalOpen] = useState(false);
  const [currentPrn, setCurrentPrn] = useState("");

  const [children, setChildren] = useState<StudentChild[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    fetchMyChildren();
  }, [user?.id]);

  const fetchMyChildren = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<StudentChild[]>(`/parents/me/students`);
      if (res.ok && res.data && Array.isArray(res.data)) {
        setChildren(res.data);
        if (res.data.length > 0 && !selectedChildId) {
          setSelectedChildId(res.data[0].id);
        }
      } else {
        setChildren([]);
      }
    } catch (err: any) {
      console.error("Failed to load children", err);
      setError(err?.message || "Failed to load linked student profiles.");
      setChildren([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async (studentId: string) => {
    try {
      const res = await apiClient.get<PaymentRecord[]>(`/finance/payments/student/${studentId}`);
      if (res.ok && res.data) {
        setPayments(Array.isArray(res.data) ? res.data : []);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Failed to fetch payments", error);
      setPayments([]);
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
      const res = await apiClient.post<{ prn: string }>(`/finance/payments`, {
        studentId: selectedChildId,
        amount: 3000,
        status: "PENDING",
        description: "Term 1 Fees"
      });
      if (res.ok && res.data) {
        setCurrentPrn(res.data.prn);
        setIsPrnModalOpen(true);
        fetchPayments(selectedChildId);
      }
    } catch (error) {
      console.error("Failed to generate payment", error);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-card relative">
      
      {/* Left Pane - My Children */}
      <div className="w-[300px] border-r flex flex-col bg-muted/20">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 font-bold text-lg text-foreground">
            <Users className="w-5 h-5 text-primary" />
            My Children
          </div>
        </div>
        
        <div className="p-4 space-y-2 flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading children...</p>
          ) : children.length === 0 ? (
            <div className="p-4 text-center rounded-xl bg-card border text-muted-foreground text-xs space-y-2">
              <p className="font-semibold text-foreground">No students linked</p>
              <p>Contact school administration to link student registration numbers to your guardian account.</p>
            </div>
          ) : (
            children.map((child: StudentChild) => (
              <div 
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                  selectedChildId === child.id 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50 border border-transparent'
                }`}
              >
                <Avatar className="h-10 w-10 border bg-card">
                  <AvatarImage src={child.imageUrl} alt={child.firstName} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {child.firstName?.[0]}{child.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">{child.firstName} {child.lastName}</span>
                  <span className="text-xs font-semibold text-muted-foreground">{child.classId || "Grade"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Pane - Dynamic Content */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-card p-8 sm:p-10 relative">
        {!selectedChildId ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <p className="text-lg font-bold text-foreground mb-1">Select a Student</p>
            <p className="text-sm text-muted-foreground">Select one of your registered children from the left panel to inspect tuition statements, download receipts, and process online fees.</p>
          </div>
        ) : (
          <div className="max-w-4xl animate-in fade-in duration-300 space-y-8">
            {/* Header */}
            <div>
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Academic Tuition & Fees</h1>
                  <p className="text-xs text-muted-foreground mt-1">Student Record: {selectedChildId}</p>
                </div>
                
                {activeTab === "pending" ? (
                  <Button onClick={handlePayFees}>
                    <Plus className="w-4 h-4 mr-2" />
                    Pay Term Fees
                  </Button>
                ) : (
                  <Button variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Bank Deposit
                  </Button>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button 
                onClick={() => setActiveTab("pending")}
                className={`flex-1 pb-4 text-sm font-bold transition-colors ${
                  activeTab === "pending" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Pending Invoices
              </button>
              <button 
                onClick={() => setActiveTab("payments")}
                className={`flex-1 pb-4 text-sm font-bold transition-colors ${
                  activeTab === "payments" 
                    ? "text-primary border-b-2 border-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Payment Ledger & History
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "pending" ? (
              <div className="border rounded-2xl overflow-hidden shadow-xs bg-card">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-bold text-foreground">Current Outstanding Tuition (Term 1 - 2025/26)</h3>
                </div>
                
                <div>
                  <div className="grid grid-cols-2 p-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b bg-muted/20">
                    <div>Fee Structure</div>
                    <div className="text-right">Billed Amount</div>
                  </div>
                  
                  <div className="divide-y">
                    <div className="grid grid-cols-2 p-5 px-6 items-center hover:bg-muted/20 transition-colors">
                      <div className="font-semibold text-foreground">Institutional & Lab Utilities</div>
                      <div className="text-right font-bold text-foreground">$1,000.00</div>
                    </div>
                    <div className="grid grid-cols-2 p-5 px-6 items-center hover:bg-muted/20 transition-colors">
                      <div className="font-semibold text-foreground">Academic Tuition</div>
                      <div className="text-right font-bold text-foreground">$2,000.00</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex justify-end bg-muted/10 border-t">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">Total Balance Due</div>
                    <div className="text-3xl font-extrabold text-foreground tracking-tight">$3,000.00</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.length === 0 ? (
                  <div className="p-8 text-center bg-muted/20 rounded-2xl border text-muted-foreground text-sm">
                    No payment transactions recorded for this student.
                  </div>
                ) : (
                  payments.map(payment => (
                    <div key={payment.id} className="border rounded-2xl p-6 shadow-xs bg-card">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        <div>
                          <h3 className="text-base font-bold text-foreground">PRN: {payment.prn}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Status: {payment.status}</p>
                        </div>
                        <div className="text-sm font-semibold text-muted-foreground">
                          {payment.description || "Tuition Installment"}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-foreground text-base">USD ${payment.amount}</span>
                          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Receipt
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-muted-foreground">Settlement Status</span>
                          <span className="text-primary font-bold">{payment.status === "PENDING" ? "Pending Bank Clearance" : "Settled (100%)"}</span>
                        </div>
                        
                        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: payment.status === "PENDING" ? '30%' : '100%' }}></div>
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
        <div className="absolute inset-0 bg-background/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl border w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-6 pb-2 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-foreground">Payment Reference Generated</h3>
                <p className="text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full inline-block mt-2 font-semibold">
                  Provide this PRN at your banking branch or mobile money agent
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setIsPrnModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 pt-4 space-y-4">
              <div className="border rounded-xl p-5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20">
                <span className="font-mono font-bold text-foreground text-lg tracking-wider break-all">
                  {currentPrn}
                </span>
                <Button onClick={() => window.print()} className="w-full sm:w-auto">
                  Print Slip
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
