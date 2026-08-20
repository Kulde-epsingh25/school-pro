"use client";

import React, { useState, useEffect } from "react";
import { Send, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt?: string;
  sender?: {
    firstName?: string;
    lastName?: string;
  };
}

interface ChatConversation {
  id: string;
  title?: string;
  updatedAt?: string;
  messages?: ChatMessage[];
}

export default function CommunicationPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  
  const { school } = useSchoolStore();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (school?.id && user?.id) {
      fetchConversations();
    }
  }, [school?.id, user?.id]);

  useEffect(() => {
    if (activeConvId && school?.id) {
      fetchMessages(activeConvId);
      const interval = setInterval(() => fetchMessages(activeConvId), 5000);
      return () => clearInterval(interval);
    }
  }, [activeConvId, school?.id]);

  const fetchConversations = async () => {
    if (!school?.id || !user?.id) return;
    try {
      const res = await apiClient.get<ChatConversation[]>(`/communication/conversations?tenantId=${school.id}&userId=${user.id}`);
      if (res.ok && res.data) setConversations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (convId: string) => {
    if (!school?.id) return;
    try {
      const res = await apiClient.get<ChatMessage[]>(`/communication/conversations/${convId}/messages?tenantId=${school.id}`);
      if (res.ok && res.data) setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId || !school?.id || !user?.id) return;

    try {
      await apiClient.post(`/communication/messages?tenantId=${school.id}`, {
        conversationId: activeConvId,
        content: newMessage,
        senderId: user.id
      });
      setNewMessage("");
      fetchMessages(activeConvId);
      fetchConversations();
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="flex h-[calc(100vh-100px)] bg-card rounded-xl shadow-sm border overflow-hidden">
      {/* Sidebar List */}
      <div className="w-1/3 border-r flex flex-col bg-muted/20">
        <div className="p-4 border-b bg-card flex items-center gap-2 font-semibold text-foreground">
          <MessageSquare className="w-5 h-5 text-primary" />
          Messages
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No conversations found.</div>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-4 border-b cursor-pointer transition-colors ${activeConvId === conv.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/50'}`}
              >
                <div className="font-semibold text-sm truncate text-foreground">{conv.title || "Faculty & Parent Room"}</div>
                <div className="text-xs text-muted-foreground truncate mt-1">
                  {conv.messages?.[0]?.content || "No messages yet"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Window */}
      <div className="flex-1 flex flex-col bg-card">
        {activeConvId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-card flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback><User className="w-4 h-4 text-primary" /></AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-foreground">{activeConv?.title || "Conversation"}</div>
                <div className="text-xs text-emerald-600 font-medium">Channel active</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
              {messages.map((msg, i) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card border shadow-xs text-foreground rounded-bl-none'}`}>
                      {!isMe && <div className="text-[10px] font-semibold mb-1 text-muted-foreground">{msg.sender?.firstName || "Member"}</div>}
                      <div className="text-sm">{msg.content}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 bg-card border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <MessageSquare className="w-16 h-16 mb-4 text-muted-foreground/30" />
            <p className="font-medium text-foreground">Select a conversation</p>
            <p className="text-xs mt-1">Chat securely with teachers, parents, and administrative staff.</p>
          </div>
        )}
      </div>
    </div>
  );
}
