"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, SwitchCamera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

// Mock Data
const messagesList = [
  {
    id: 1,
    sender: "Ms. Johnson",
    time: "about 1 year ago",
    subject: "Math Class Performance Update",
    snippet: "I wanted to discuss John's recent...",
    tags: ["academic", "important"],
    isActive: true,
  },
  {
    id: 2,
    sender: "Principal Williams",
    time: "about 1 year ago",
    subject: "Upcoming Parent-Teacher Conference",
    snippet: "This is a reminder about the upcomin...",
    tags: ["administrative"],
    isActive: false,
  },
  {
    id: 3,
    sender: "Coach Thompson",
    time: "about 1 year ago",
    subject: "Basketball Team Practice Schedule",
    snippet: "Here's the updated basketball...",
    tags: ["sports", "schedule"],
    isActive: false,
  },
];

export default function MessagesPage() {
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50 p-6">
      <div className="flex-1 bg-white border border-gray-100 rounded-xl shadow-sm flex overflow-hidden">
        
        {/* Left Pane - Message List */}
        <div className="w-[350px] border-r border-gray-100 flex flex-col">
          <div className="p-4 border-b border-gray-50 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                className="pl-9 bg-gray-50/50 border-gray-200"
              />
            </div>
            <Button 
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium"
              onClick={() => setIsComposeOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {messagesList.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-4 rounded-xl cursor-pointer transition-colors mb-2 ${msg.isActive ? 'bg-gray-50' : 'hover:bg-gray-50/50'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-gray-900 text-sm">{msg.sender}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{msg.time}</span>
                    {msg.isActive && <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />}
                  </div>
                </div>
                <div className="font-semibold text-gray-800 text-sm mb-1">{msg.subject}</div>
                <div className="text-xs text-gray-500 mb-3 truncate">{msg.snippet}</div>
                <div className="flex gap-2">
                  {msg.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane - Message Detail */}
        <div className="flex-1 flex flex-col relative">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12 bg-gray-100 text-gray-600 font-bold">
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ms. Johnson</h2>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Math Class Performance Update</h3>
                <p className="text-sm text-gray-500">Reply-To: johnson@school.edu</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              Jan 2, 2024, 2:30 PM
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 border border-gray-200">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="prose max-w-none text-gray-700 text-sm space-y-4">
              <p>I wanted to discuss John's recent progress in mathematics. He's shown remarkable improvement in algebra concepts over the past few weeks.</p>
              <p>His participation in class has increased significantly, and he's been helping other students understand complex problems.</p>
              <p>Would you be available for a brief meeting next week to discuss strategies to further support his mathematical development?</p>
            </div>
          </div>

          {/* Reply Box */}
          <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex items-end gap-4">
              <Textarea 
                placeholder="Type your reply..." 
                className="min-h-[80px] resize-none bg-gray-50/50 border-gray-200"
              />
              <div className="flex flex-col gap-4">
                <Button className="w-[120px] bg-[#2563EB] hover:bg-blue-700 text-white font-medium">
                  Send
                </Button>
                <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
                  <div className="relative inline-block w-8 h-4 bg-gray-200 rounded-full"></div>
                  Mute this thread
                </label>
              </div>
            </div>
          </div>

          {/* COMPOSE MODAL OVERLAY */}
          {isComposeOpen && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-[500px] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-900">New Message</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={() => setIsComposeOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">To</label>
                    <select className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:border-blue-500 bg-white">
                      <option>Select recipient</option>
                      <option>Class Teacher</option>
                      <option>Principal</option>
                      <option>Administrator</option>
                      <option>School Counselor</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Subject</label>
                    <Input className="border-gray-200 focus-visible:ring-blue-500" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Message</label>
                    <Textarea className="min-h-[150px] resize-none border-gray-200 focus-visible:ring-blue-500" />
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                  <Button variant="outline" className="border-gray-200 text-gray-600 font-medium" onClick={() => setIsComposeOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium">
                    Send Message
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
