import { Request, Response } from "express";
import { db as prisma } from "../db";

export const getBooks = async (req: Request, res: Response) => {
  const { tenantId, search } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const where: any = { tenantId };
    
    if (search && typeof search === 'string') {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { isbn: { contains: search, mode: "insensitive" } }
      ];
    }

    const books = await prisma.book.findMany({
      where,
      orderBy: { title: "asc" }
    });

    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

export const addBook = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { title, author, isbn, category, totalCopies } = req.body;

  if (!tenantId || !title || !author || !totalCopies) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const book = await prisma.book.create({
      data: {
        tenantId: tenantId as string,
        title,
        author,
        isbn,
        category,
        totalCopies,
        availableCopies: totalCopies
      }
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
};

export const issueBook = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { bookId, userId } = req.body;
  const issuedBy = ((req as any).user?.id || "");

  if (!tenantId || !bookId || !userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      
      if (!book || book.availableCopies <= 0) {
        throw new Error("Book is not available");
      }

      // Decrement available copies
      await tx.book.update({
        where: { id: bookId },
        data: { availableCopies: { decrement: 1 } }
      });

      // Default due date to 14 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      // Create issue record
      return await tx.bookIssue.create({
        data: {
          tenantId: tenantId as string,
          bookId,
          userId,
          dueDate,
          issuedBy: issuedBy || "system"
        },
        include: { book: true, user: true }
      });
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error("Error issuing book:", error);
    res.status(500).json({ error: error.message || "Failed to issue book" });
  }
};

export const returnBook = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { issueId } = req.body;

  if (!tenantId || !issueId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const issue = await tx.bookIssue.findUnique({ 
        where: { id: issueId },
        include: { book: true }
      });
      
      if (!issue || issue.isReturned) {
        throw new Error("Invalid or already returned issue record");
      }

      const returnDate = new Date();
      let fineAmount = 0;
      
      // Calculate fine if overdue ($1 per day late)
      if (returnDate > issue.dueDate) {
        const diffTime = Math.abs(returnDate.getTime() - issue.dueDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        fineAmount = diffDays * 1.0; 
      }

      // Increment available copies
      await tx.book.update({
        where: { id: issue.bookId },
        data: { availableCopies: { increment: 1 } }
      });

      // Update issue record
      return await tx.bookIssue.update({
        where: { id: issueId },
        data: {
          isReturned: true,
          returnDate,
          fineAmount
        },
        include: { book: true }
      });
    });

    res.json(result);
  } catch (error: any) {
    console.error("Error returning book:", error);
    res.status(500).json({ error: error.message || "Failed to return book" });
  }
};

export const getMyBooks = async (req: Request, res: Response) => {
  const { tenantId, userId } = req.query;

  if (!tenantId || typeof tenantId !== 'string' || !userId || typeof userId !== 'string') {
    return res.status(400).json({ error: "Tenant ID and User ID required" });
  }

  try {
    const issues = await prisma.bookIssue.findMany({
      where: { tenantId, userId },
      include: { book: true },
      orderBy: { issueDate: "desc" }
    });

    res.json(issues);
  } catch (error) {
    console.error("Error fetching issued books:", error);
    res.status(500).json({ error: "Failed to fetch issued books" });
  }
};

export const getActiveIssues = async (req: Request, res: Response) => {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: "Tenant ID required" });
  }

  try {
    const issues = await prisma.bookIssue.findMany({
      where: { tenantId, isReturned: false },
      include: { 
        book: true,
        user: true
      },
      orderBy: { issueDate: "desc" }
    });

    res.json(issues);
  } catch (error) {
    console.error("Error fetching active issues:", error);
    res.status(500).json({ error: "Failed to fetch active issues" });
  }
};


