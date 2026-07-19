"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TemplateBuilderProps {
  onSave: (data: { name: string, type: string, content: string }) => void;
  onCancel: () => void;
  initialData?: { name: string, type: string, content: string };
}

export function TemplateBuilder({ onSave, onCancel, initialData }: TemplateBuilderProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [type, setType] = useState(initialData?.type || "CERTIFICATE");
  const [content, setContent] = useState(initialData?.content || `
<div style="font-family: Arial, sans-serif; text-align: center; padding: 50px; border: 10px solid #ddd;">
  <h1 style="color: #4F46E5;">Certificate of Achievement</h1>
  <p>This is to certify that</p>
  <h2 style="font-size: 2em; margin: 20px 0;">{{studentName}}</h2>
  <p>has successfully completed the program.</p>
  <div style="margin-top: 50px; text-align: right;">
    <p>_______________________</p>
    <p>Principal Signature</p>
  </div>
</div>
`.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, type, content });
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold">Template Builder</h2>
        <Button variant="ghost" onClick={onCancel}>Close</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold mb-1 block">Template Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Annual Sports Certificate" required />
          </div>
          <div>
            <label className="text-sm font-semibold mb-1 block">Document Type</label>
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="CERTIFICATE">Certificate</option>
              <option value="REPORT_CARD">Report Card</option>
              <option value="ADMIT_CARD">Admit Card</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-1 block flex justify-between">
            HTML Content
            <span className="text-xs text-blue-600 font-normal">Use {"{{placeholder}}"} for dynamic fields</span>
          </label>
          <Textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            rows={12} 
            className="font-mono text-sm"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Save Template</Button>
        </div>
      </form>
    </div>
  );
}
