import { Request, Response } from "express";
import { db } from "../db";
import { generatePdfFromHtml, replacePlaceholders } from "../services/pdfService";

export async function getTemplates(req: Request, res: Response) {
  const { tenantId } = req.query;
  if (!tenantId || typeof tenantId !== "string") {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const templates = await db.documentTemplate.findMany({
      where: { tenantId }
    });
    res.json(templates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
}

export async function createTemplate(req: Request, res: Response) {
  const { tenantId } = req.query;
  const { name, type, content, userId } = req.body;
  if (!tenantId || typeof tenantId !== "string") {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const template = await db.documentTemplate.create({
      data: {
        name,
        type,
        content,
        tenantId,
        createdBy: userId
      }
    });
    res.status(201).json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create template" });
  }
}

export async function updateTemplate(req: Request, res: Response) {
  const { tenantId } = req.query;
  const { id } = req.params;
  const { name, type, content } = req.body;
  
  try {
    const template = await db.documentTemplate.update({
      where: { id, tenantId: tenantId as string },
      data: { name, type, content }
    });
    res.json(template);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update template" });
  }
}

export async function generateDocument(req: Request, res: Response) {
  const { tenantId } = req.query;
  const { templateId, data, userId, studentId, documentName } = req.body;

  try {
    const template = await db.documentTemplate.findUnique({
      where: { id: templateId, tenantId: tenantId as string }
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // Process HTML
    const processedHtml = replacePlaceholders(template.content, data || {});
    
    // Generate PDF
    const pdfBuffer = await generatePdfFromHtml(processedHtml);

    // Save record (in a real app, upload buffer to S3 and save URL)
    const doc = await db.generatedDocument.create({
      data: {
        name: documentName || `${template.name} - Generated`,
        documentUrl: `/temp/${Date.now()}.pdf`, // mock URL
        studentId: studentId,
        tenantId: tenantId as string,
        createdBy: userId
      }
    });

    // Send PDF back directly
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${doc.name}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate document" });
  }
}

export async function batchGenerateDocuments(req: Request, res: Response) {
  const { tenantId } = req.query;
  const { templateId, batchData, userId } = req.body;

  try {
    const template = await db.documentTemplate.findUnique({
      where: { id: templateId, tenantId: tenantId as string }
    });

    if (!template) {
      return res.status(404).json({ error: "Template not found" });
    }

    // In a real implementation, we would generate a ZIP file of all PDFs.
    // For this MVP, we will generate the first one and return it, while
    // saving records for all of them.
    const results = [];
    let firstPdfBuffer: Buffer | null = null;

    for (let i = 0; i < batchData.length; i++) {
      const item = batchData[i];
      const processedHtml = replacePlaceholders(template.content, item.data || {});
      
      const doc = await db.generatedDocument.create({
        data: {
          name: item.documentName || `${template.name} - Generated`,
          documentUrl: `/temp/${Date.now()}.pdf`,
          studentId: item.studentId,
          tenantId: tenantId as string,
          createdBy: userId
        }
      });
      results.push(doc);

      if (i === 0) {
         firstPdfBuffer = await generatePdfFromHtml(processedHtml);
      }
    }

    if (firstPdfBuffer) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="batch_sample.pdf"`);
      return res.send(firstPdfBuffer);
    } else {
       return res.json({ success: true, count: results.length });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to batch generate" });
  }
}

