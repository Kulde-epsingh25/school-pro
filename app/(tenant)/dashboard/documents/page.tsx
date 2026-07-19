"use client";

import React, { useEffect, useState } from "react";
import { FileText, Plus, Download, Edit } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";
import { TemplateBuilder } from "@/components/documents/TemplateBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DocumentsPage() {
  const { school } = useSchoolStore();
  const user = useAuthStore(state => state.user);
  
  const [templates, setTemplates] = useState<any[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [generating, setGenerating] = useState(false);
  const [generateData, setGenerateData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (school?.id) {
      fetchTemplates();
    }
  }, [school?.id]);

  const fetchTemplates = async () => {
    try {
      const res = await apiClient.get<any[]>(`/documents/templates?tenantId=${school?.id}`);
      if (res.ok && res.data) {
        setTemplates(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTemplate = async (data: { name: string, type: string, content: string }) => {
    try {
      if (editingTemplate) {
        await apiClient.put(`/documents/templates/${editingTemplate.id}?tenantId=${school?.id}`, data);
      } else {
        await apiClient.post(`/documents/templates?tenantId=${school?.id}`, { ...data, userId: user?.id });
      }
      setShowBuilder(false);
      setEditingTemplate(null);
      fetchTemplates();
    } catch (err) {
      console.error(err);
    }
  };

  const extractPlaceholders = (content: string) => {
    const matches = content.match(/\{\{([^}]+)\}\}/g) || [];
    return matches.map(m => m.replace(/[{}]/g, ''));
  };

  const handleGenerate = async (template: any) => {
    const placeholders = extractPlaceholders(template.content);
    if (placeholders.length > 0 && Object.keys(generateData).length === 0) {
      alert(`Please provide data for: ${placeholders.join(', ')}`);
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/documents/generate?tenantId=${school?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          templateId: template.id,
          userId: user?.id,
          data: generateData
        })
      });

      if (!response.ok) throw new Error("Generation failed");

      // Handle PDF download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setGenerateData({}); // reset
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF. Make sure the backend puppeteer service is running.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Document Generation</h1>
          <p className="text-gray-500 mt-2">Manage and generate certificates, report cards, and admit cards.</p>
        </div>
        <Button onClick={() => { setEditingTemplate(null); setShowBuilder(true); }} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {showBuilder ? (
        <TemplateBuilder 
          onSave={handleSaveTemplate} 
          onCancel={() => { setShowBuilder(false); setEditingTemplate(null); }}
          initialData={editingTemplate}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <div key={template.id} className="rounded-xl border bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold bg-gray-100 px-2 py-1 rounded text-gray-600">{template.type}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900">{template.name}</h3>
                
                <div className="mt-4 space-y-2 border-t pt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Test Generation:</p>
                  {extractPlaceholders(template.content).map(p => (
                    <Input 
                      key={p} 
                      placeholder={`Enter ${p}`} 
                      className="h-8 text-xs"
                      onChange={(e) => setGenerateData({ ...generateData, [p]: e.target.value })}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => { setEditingTemplate(template); setShowBuilder(true); }}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => handleGenerate(template)} disabled={generating}>
                  <Download className="w-4 h-4 mr-2" /> {generating ? '...' : 'PDF'}
                </Button>
              </div>
            </div>
          ))}
          {templates.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No document templates found.</p>
              <p className="text-sm">Click "Create Template" to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
