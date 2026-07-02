"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

interface Stream {
  id: string;
  name: string;
}

interface ClassItem {
  id: string;
  name: string;
  streams: Stream[];
  _count: {
    students: number;
  };
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [newStreamName, setNewStreamName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://school-pro-api-6mxq.onrender.com/classes");
      if (res.ok) {
        const data = await res.json();
        setClasses(data);
      }
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClass = async () => {
    if (!newClassName.trim()) return;
    try {
      const res = await fetch("https://school-pro-api-6mxq.onrender.com/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newClassName }),
      });
      if (res.ok) {
        toast.success("Class created");
        setNewClassName("");
        setIsAddClassOpen(false);
        fetchClasses();
      } else {
        toast.error("Failed to create class");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleAddStream = async () => {
    if (!selectedClass || !newStreamName.trim()) return;
    try {
      const res = await fetch("https://school-pro-api-6mxq.onrender.com/streams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newStreamName, classId: selectedClass.id }),
      });
      if (res.ok) {
        toast.success("Stream added");
        setNewStreamName("");
        fetchClasses();
        // Update selected class streams locally
        const newStream = await res.json();
        setSelectedClass({ ...selectedClass, streams: [...selectedClass.streams, newStream] });
      } else {
        toast.error("Failed to add stream");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const filteredClasses = classes.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left Pane - Classes List */}
      <div className="w-1/3 border-r bg-gray-50/40 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M21.42 10.922a2 2 0 0 1-.019 3.838L12.83 19.298a2 2 0 0 1-1.66 0L2.6 14.76a2 2 0 0 1-.019-3.838l8.57-4.538a2 2 0 0 1 1.698 0l8.57 4.538z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
            Classes
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsAddClassOpen(true)}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        <Input 
          placeholder="Search classes..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 bg-white"
        />

        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
          ) : filteredClasses.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No classes found</p>
          ) : (
            filteredClasses.map((cls) => (
              <div 
                key={cls.id} 
                onClick={() => setSelectedClass(cls)}
                className={`p-4 rounded-xl cursor-pointer flex justify-between items-center group transition-colors
                  ${selectedClass?.id === cls.id ? 'bg-gray-100' : 'hover:bg-gray-100'}
                `}
              >
                <div>
                  <div className="font-semibold text-sm">
                    {cls.name} <span className="text-gray-400 font-normal ml-1">{cls.streams.length} streams</span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    {cls._count.students} students
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-600">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Pane - Class Details */}
      <div className="flex-1 p-6 bg-white flex flex-col">
        {!selectedClass ? (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select the Class to see the Details
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={() => setSelectedClass(null)} className="md:hidden">
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h2 className="text-xl font-bold">{selectedClass.name}</h2>
                  <p className="text-sm text-gray-500">Classes / {selectedClass.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="New stream (e.g. 1A)"
                  value={newStreamName}
                  onChange={(e) => setNewStreamName(e.target.value)}
                  className="w-40"
                />
                <Button variant="outline" onClick={handleAddStream} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Stream
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {selectedClass.streams.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-12">
                  No streams in this class yet. Add one above.
                </div>
              ) : (
                selectedClass.streams.map((stream) => (
                  <div key={stream.id} className="border rounded-xl p-4 relative group">
                    <h3 className="font-bold text-lg mb-2">{stream.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">Class Teacher: Not assigned</p>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      0 students
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Add Class Modal */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="e.g. S1" 
              className="border-blue-300 focus-visible:ring-blue-500"
            />
            <Button onClick={handleAddClass} className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" /> Add
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
