"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PerformanceChartProps {
  data: any[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-gray-400">No performance data available</div>;
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#4F46E5" activeDot={{ r: 8 }} name="Avg Score %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
