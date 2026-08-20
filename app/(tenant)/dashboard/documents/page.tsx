"use client";

import React, { useEffect, useState } from "react";
import { FileText, Plus, Download, Edit, AlertCircle, RefreshCw } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";
import { getApiUrl } from "@/lib/constants";
import { TemplateBuilder } from "@/components/documents/TemplateBuilder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  content: string;
  createdAt?: string;
}

export default function DocumentsPage() {
  const { school } = useSchoolStore();
  const user = useAuthStore(state => state.user);
  
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<DocumentTemplate | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateData, setGenerateData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (school?.id) {
      fetchTemplates();
    }
  }, [school?.id]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<DocumentTemplate[]>(`/documents/templates?tenantId=${school?.id}`);
      if (res.ok && res.data) {
        setTemplates(Array.isArray(res.data) ? res.data : []);
      } else {
        throw new Error(res.error || "Failed to load document templates");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Unable to fetch document templates.");
      setTemplates([]);
    } finally {
      setLoading(false);
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

  const handleGenerate = async (template: DocumentTemplate) => {
    const placeholders = extractPlaceholders(template.content);
    if (placeholders.length > 0 && Object.keys(generateData).length === 0) {
      alert(`Please provide data for: ${placeholders.join(', ')}`);
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(`${getApiUrl()}/api/documents/generate?tenantId=${school?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Document Generation</h1>
          <p className="text-muted-foreground mt-2">Manage and generate certificates, report cards, and admit cards.</p>
        </div>
        <Button onClick={() => { setEditingTemplate(null); setShowBuilder(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-destructive/30 bg-destructive/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-semibold text-destructive">Template Engine Error</p>
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchTemplates} className="gap-2 h-8 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}

      {showBuilder ? (
        <TemplateBuilder 
          onSave={handleSaveTemplate} 
          onCancel={() => { setShowBuilder(false); setEditingTemplate(null); }}
          initialData={editingTemplate ? { name: editingTemplate.name, type: editingTemplate.type, content: editingTemplate.content } : undefined}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <div key={template.id} className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold bg-muted px-2.5 py-1 rounded text-foreground">{template.type}</span>
                </div>
                <h3 className="font-bold text-lg text-foreground">{template.name}</h3>
                
                <div className="mt-4 space-y-2 border-t pt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Test Dynamic Parameters:</p>
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
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleGenerate(template)} disabled={generating}>
                  <Download className="w-4 h-4 mr-2" /> {generating ? 'Generating...' : 'Download PDF'}
                </Button>
              </div>
            </div>
          ))}
          {templates.length === 0 && !loading && (
            <div className="col-span-full py-12 text-center border-2 border-dashed rounded-xl text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
              <p className="font-medium text-foreground">No document templates found.</p>
              <p className="text-sm mt-1">Click "Create Template" to design certificates and transcript letters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
