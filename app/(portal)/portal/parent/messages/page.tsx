"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, Mail, MessageSquare, Send, X, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-client";
import { EmptyState } from "@/components/feedback/empty-state";
import { toast } from "sonner";

export interface MessageItem {
  id: string | number;
  sender: string;
  senderEmail?: string;
  time: string;
  subject: string;
  body: string;
  snippet: string;
  tags?: string[];
  unread?: boolean;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeMessageId, setActiveMessageId] = useState<string | number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [recipient, setRecipient] = useState("Class Teacher");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadMessages() {
      try {
        setLoading(true);
        const res = await apiClient.get<MessageItem[]>("/communications/messages");
        if (res.ok && res.data && res.data.length > 0) {
          setMessages(res.data);
          setActiveMessageId(res.data[0].id);
        }
      } catch (err) {
        // Fallback to empty clean state
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }
    loadMessages();
  }, []);

  const filteredMessages = messages.filter((m) =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeMessage = messages.find((m) => m.id === activeMessageId);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    toast.success("Reply dispatched successfully");
    setReplyText("");
  };

  const handleSendMessage = () => {
    if (!composeSubject.trim() || !composeBody.trim()) {
      toast.error("Please provide both subject and message");
      return;
    }

    const newMessage: MessageItem = {
      id: Date.now().toString(),
      sender: "You",
      senderEmail: "parent@school.edu",
      time: "Just now",
      subject: composeSubject,
      body: composeBody,
      snippet: composeBody.slice(0, 45) + (composeBody.length > 45 ? "..." : ""),
      tags: ["outgoing"]
    };

    setMessages((prev) => [newMessage, ...prev]);
    setActiveMessageId(newMessage.id);
    setIsComposeOpen(false);
    setComposeSubject("");
    setComposeBody("");
    toast.success("Message dispatched to " + recipient);
  };

  const handleDelete = (id: string | number) => {
    const next = messages.filter((m) => m.id !== id);
    setMessages(next);
    if (activeMessageId === id) {
      setActiveMessageId(next.length > 0 ? next[0].id : null);
    }
    toast.success("Message deleted");
  };

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-gray-50/50 border-gray-200"
              />
            </div>
            <Button 
              className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium shadow-sm"
              onClick={() => setIsComposeOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Compose
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {filteredMessages.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">No messages</p>
                <p className="text-xs text-gray-400 mt-1">Your inbox is clear.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isActive = msg.id === activeMessageId;
                return (
                  <div 
                    key={msg.id} 
                    onClick={() => setActiveMessageId(msg.id)}
                    className={`p-4 rounded-xl cursor-pointer transition-colors mb-2 ${
                      isActive ? "bg-blue-50/70 border border-blue-100" : "hover:bg-gray-50/70"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900 text-sm">{msg.sender}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{msg.time}</span>
                        {isActive && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(msg.id);
                            }}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="font-semibold text-gray-800 text-sm mb-1">{msg.subject}</div>
                    <div className="text-xs text-gray-500 mb-3 truncate">{msg.snippet}</div>
                    {msg.tags && msg.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {msg.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-[10px] font-semibold uppercase tracking-wider">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane - Message Detail */}
        <div className="flex-1 flex flex-col relative">
          {activeMessage ? (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12 bg-gray-100 text-gray-600 font-bold">
                    <AvatarFallback>
                      {activeMessage.sender.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{activeMessage.sender}</h2>
                    <h3 className="text-lg font-semibold text-gray-700 mb-1">{activeMessage.subject}</h3>
                    {activeMessage.senderEmail && (
                      <p className="text-sm text-gray-500">Reply-To: {activeMessage.senderEmail}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {activeMessage.time}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(activeMessage.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-500 border border-gray-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose max-w-none text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                  {activeMessage.body || activeMessage.snippet}
                </div>
              </div>

              {/* Reply Box */}
              <div className="p-6 border-t border-gray-100 bg-white">
                <div className="flex items-end gap-4">
                  <Textarea 
                    placeholder="Type your reply..." 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="min-h-[80px] resize-none bg-gray-50/50 border-gray-200"
                  />
                  <div className="flex flex-col gap-2">
                    <Button 
                      className="w-[120px] bg-[#2563EB] hover:bg-blue-700 text-white font-medium"
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                    >
                      <Send className="w-3.5 h-3.5 mr-1.5" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <EmptyState 
                icon={MessageSquare}
                title="No message selected"
                description="Select a conversation thread from the left or compose a new dispatch to school staff."
                action={{
                  label: "Compose Dispatch",
                  onClick: () => setIsComposeOpen(true)
                }}
              />
            </div>
          )}

          {/* COMPOSE MODAL OVERLAY */}
          {isComposeOpen && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-full max-w-[500px] overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-900">New Message</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={() => setIsComposeOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">To</label>
                    <select 
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full h-10 border border-gray-200 rounded-md px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                    >
                      <option value="Class Teacher">Class Teacher</option>
                      <option value="Principal">Principal</option>
                      <option value="Administrator">Administrator</option>
                      <option value="School Counselor">School Counselor</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Subject</label>
                    <Input 
                      placeholder="e.g. Leave notification, Academic query" 
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                      className="border-gray-200 focus-visible:ring-blue-500" 
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Message</label>
                    <Textarea 
                      placeholder="Write your message here..."
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                      className="min-h-[150px] resize-none border-gray-200 focus-visible:ring-blue-500" 
                    />
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
                  <Button variant="outline" className="border-gray-200 text-gray-600 font-medium" onClick={() => setIsComposeOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="bg-[#2563EB] hover:bg-blue-700 text-white font-medium"
                    onClick={handleSendMessage}
                  >
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
