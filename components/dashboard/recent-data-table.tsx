"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function RecentDataTable({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <Tabs defaultValue="recent-orders" className="w-full">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="recent-orders">
                Recent Orders
              </TabsTrigger>
              <TabsTrigger value="best-selling">
                Best Selling Products
              </TabsTrigger>
              <TabsTrigger value="recent-customers">
                Recent Customers
              </TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
            <Button variant="ghost" className="h-8 text-xs">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <TabsContent
            value="recent-orders"
            className="border-none p-0 pt-3"
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {order.customer}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {order.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{order.source}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "DELIVERED" || order.status === "ENROLLED"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}
