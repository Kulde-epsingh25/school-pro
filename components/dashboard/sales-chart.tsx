"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function SalesChart({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base">Sales Chart</CardTitle>
          <p className="text-xs text-muted-foreground">
            Sun 27th Oct - Sat 2nd Nov
          </p>
        </div>
        <Button variant="ghost" className="h-8 text-xs">
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#000000"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#000000"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#fa7e26"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-muted-foreground">
          The day with highest sales is{" "}
          <span className="font-medium">with 0 sales</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Showing the sales for the last 7 days including today
        </div>
      </CardContent>
    </Card>
  );
}
