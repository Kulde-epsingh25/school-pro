"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">
            Revenue By Category Chart
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Total: $17,722,013
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Bar
                dataKey="value"
                fill="#f97316"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-muted-foreground">
          Leading Month is July and leading Category is Computers
        </div>
        <div className="text-xs text-muted-foreground">
          Showing total revenue for the past 6 months
        </div>
      </CardContent>
    </Card>
  );
}
