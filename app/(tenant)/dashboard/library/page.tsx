"use client";

import React, { useState, useEffect } from "react";
import { Book as BookIcon, Search, Plus, BookOpen, Clock, Check } from "lucide-react";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LibraryPage() {
  const { school } = useSchoolStore();
  const user = useAuthStore(state => state.user);
  
  const [activeTab, setActiveTab] = useState<"CATALOG" | "MY_BOOKS" | "ADMIN">("CATALOG");
  const [books, setBooks] = useState<any[]>([]);
  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  // Admin form states
  const [newBook, setNewBook] = useState({ title: "", author: "", isbn: "", category: "", totalCopies: 1 });
  const [issueData, setIssueData] = useState({ bookId: "", userId: "" });
  const [returnId, setReturnId] = useState("");

  useEffect(() => {
    if (school?.id) {
      fetchBooks();
      if (user?.id) fetchMyBooks();
    }
  }, [school?.id, user?.id]);

  const fetchBooks = async () => {
    try {
      const q = search ? `&search=${encodeURIComponent(search)}` : "";
      const res = await apiClient.get<any[]>(`/library/books?tenantId=${school?.id}${q}`);
      if (res.ok && res.data) setBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyBooks = async () => {
    try {
      const res = await apiClient.get<any[]>(`/library/my-books?tenantId=${school?.id}&userId=${user?.id}`);
      if (res.ok && res.data) setMyBooks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (school?.id) fetchBooks();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/library/books?tenantId=${school?.id}`, newBook);
      setNewBook({ title: "", author: "", isbn: "", category: "", totalCopies: 1 });
      alert("Book added successfully");
      fetchBooks();
    } catch (err) {
      alert("Failed to add book");
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/library/issue?tenantId=${school?.id}`, issueData);
      setIssueData({ bookId: "", userId: "" });
      alert("Book issued successfully");
      fetchBooks();
    } catch (err: any) {
      alert(err.message || "Failed to issue book");
    }
  };

  const handleReturnBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(`/library/return?tenantId=${school?.id}`, { issueId: returnId });
      setReturnId("");
      alert("Book returned successfully");
      fetchBooks();
    } catch (err: any) {
      alert(err.message || "Failed to return book");
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Library Management</h1>
          <p className="text-gray-500 mt-2">Manage catalog, issue books, and track returns.</p>
        </div>
      </div>

      <div className="flex border-b">
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'CATALOG' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('CATALOG')}
        >
          Catalog
        </button>
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'MY_BOOKS' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('MY_BOOKS')}
        >
          My Books
        </button>
        {/* Only show Admin tab if user is an admin or staff. For MVP, we'll just show it always. */}
        <button 
          className={`px-6 py-3 font-semibold ${activeTab === 'ADMIN' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('ADMIN')}
        >
          Admin Portal
        </button>
      </div>

      {activeTab === 'CATALOG' && (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search by title, author, or ISBN..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {books.map(book => (
              <div key={book.id} className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                      <BookIcon className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${book.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {book.availableCopies > 0 ? `${book.availableCopies} Available` : 'Out of Stock'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg">{book.title}</h3>
                  <p className="text-sm text-gray-500">by {book.author}</p>
                  
                  <div className="mt-4 space-y-1 text-xs text-gray-400">
                    <p>ISBN: {book.isbn || 'N/A'}</p>
                    <p>Category: {book.category || 'General'}</p>
                    <p>Total Copies: {book.totalCopies}</p>
                  </div>
                </div>
              </div>
            ))}
            {books.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                <BookIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p>No books found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'MY_BOOKS' && (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b font-semibold bg-gray-50">My Issued Books</div>
          <table className="w-full text-sm text-left">
            <thead className="bg-white text-gray-700 border-b">
              <tr>
                <th className="px-6 py-3">Book Title</th>
                <th className="px-6 py-3">Issued On</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Fines</th>
              </tr>
            </thead>
            <tbody>
              {myBooks.map(issue => (
                <tr key={issue.id} className="border-t bg-white">
                  <td className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-400" />
                      {issue.book?.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">{new Date(issue.issueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {new Date(issue.dueDate).toLocaleDateString()}
                    {!issue.isReturned && new Date(issue.dueDate) < new Date() && (
                      <span className="ml-2 text-xs text-red-600 font-bold flex items-center gap-1 inline-flex">
                        <Clock className="w-3 h-3" /> Overdue
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {issue.isReturned ? (
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Returned
                      </span>
                    ) : (
                      <span className="text-blue-600 font-semibold">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    ${issue.fineAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
              {myBooks.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">You have no issued books.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'ADMIN' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Add Book */}
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Add New Book
            </h2>
            <form onSubmit={handleAddBook} className="space-y-4">
              <Input placeholder="Title" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} required />
              <Input placeholder="Author" value={newBook.author} onChange={e => setNewBook({...newBook, author: e.target.value})} required />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="ISBN" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
                <Input placeholder="Category" value={newBook.category} onChange={e => setNewBook({...newBook, category: e.target.value})} />
              </div>
              <Input type="number" min="1" placeholder="Total Copies" value={newBook.totalCopies} onChange={e => setNewBook({...newBook, totalCopies: parseInt(e.target.value)})} required />
              <Button type="submit" className="w-full bg-blue-600">Save Book</Button>
            </form>
          </div>

          <div className="space-y-6">
            {/* Issue Book */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" /> Issue Book
              </h2>
              <form onSubmit={handleIssueBook} className="space-y-4">
                <Input placeholder="Book ID" value={issueData.bookId} onChange={e => setIssueData({...issueData, bookId: e.target.value})} required />
                <Input placeholder="User/Student ID" value={issueData.userId} onChange={e => setIssueData({...issueData, userId: e.target.value})} required />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">Issue Book</Button>
              </form>
            </div>

            {/* Return Book */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Check className="w-5 h-5 text-orange-600" /> Return Book
              </h2>
              <form onSubmit={handleReturnBook} className="space-y-4">
                <Input placeholder="Issue Record ID" value={returnId} onChange={e => setReturnId(e.target.value)} required />
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">Process Return</Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
