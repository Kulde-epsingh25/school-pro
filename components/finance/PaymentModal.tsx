"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaymentModalProps {
  fee: any;
  remainingAmount: number;
  onClose: () => void;
  onSubmit: (data: { amount: number; method: string; reference: string }) => void;
}

export function PaymentModal({ fee, remainingAmount, onClose, onSubmit }: PaymentModalProps) {
  const [amount, setAmount] = useState<number>(remainingAmount);
  const [method, setMethod] = useState("ONLINE");
  const [reference, setReference] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > remainingAmount) {
      alert("Amount cannot exceed remaining balance!");
      return;
    }
    onSubmit({ amount, method, reference });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-2">Record Payment</h2>
        <p className="text-gray-500 mb-6">Payment for: {fee.title}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Amount Remaining</label>
            <div className="p-3 bg-gray-50 rounded border text-lg font-bold">${remainingAmount.toFixed(2)}</div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-1 block">Payment Amount ($)</label>
            <Input 
              type="number" 
              step="0.01" 
              max={remainingAmount} 
              value={amount} 
              onChange={(e) => setAmount(parseFloat(e.target.value))} 
              required 
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-1 block">Payment Method</label>
            <select 
              value={method} 
              onChange={(e) => setMethod(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="ONLINE">Online / Card</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold mb-1 block">Reference (Optional)</label>
            <Input 
              placeholder="Transaction ID or Receipt No."
              value={reference} 
              onChange={(e) => setReference(e.target.value)} 
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Submit Payment</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
