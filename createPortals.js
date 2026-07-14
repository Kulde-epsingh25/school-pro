const fs = require('fs');
const path = require('path');

const pagesToCreate = [
  { url: '/portal/student', title: 'Student Dashboard' },
  { url: '/portal/student/attendance', title: 'My Attendance' },
  { url: '/portal/student/report-cards', title: 'My Report Cards' },
  { url: '/portal/student/fees', title: 'My Fees' },
  { url: '/portal/parent', title: 'Parent Dashboard' },
  { url: '/portal/parent/attendance', title: 'Children Attendance' },
  { url: '/portal/parent/report-cards', title: 'Children Report Cards' },
  { url: '/portal/parent/fees', title: 'Fee Payments' },
];

const tenantAppDir = path.join(__dirname, 'app', '(tenant)');

for (const { url, title } of pagesToCreate) {
  const pagePath = path.join(tenantAppDir, url, 'page.tsx');
  const dir = path.dirname(pagePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = title.replace(/\s+/g, '');
  
  const content = `"use client";
import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";

export default function ${componentName}Page() {
  const user = useAuthStore(state => state.user);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Construct an API endpoint matching the current route
      const endpoint = "/api" + window.location.pathname;
      const res = await apiClient.get<any>(endpoint);
      
      if (res.ok) {
        setData(res.data);
      } else {
        setError(res.error || "No data available.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="${title}" />
      <Card>
        <CardHeader>
          <CardTitle>${title}</CardTitle>
          <CardDescription>View your personalized information and records.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground">Loading information...</div>
          ) : error ? (
            <div className="py-8 text-center text-amber-600 bg-amber-50 rounded-md border border-amber-200">
              {error} - This feature is currently being integrated with the backend API.
            </div>
          ) : data && Array.isArray(data) && data.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <pre className="text-xs p-4 bg-slate-50 rounded-md">{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
`;

  fs.writeFileSync(pagePath, content);
  console.log(`Created ${pagePath}`);
}
