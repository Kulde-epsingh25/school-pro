"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface FinancialChartProps {
  data: any[];
}

export function FinancialChart({ data }: FinancialChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No financial data available</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value: any) => [`$${value}`, undefined]} />
          <Legend />
          <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
          <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
