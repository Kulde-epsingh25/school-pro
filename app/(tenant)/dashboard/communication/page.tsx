"use client";

import React, { useState, useEffect } from "react";
import { Send, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CommunicationPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
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
      const res = await apiClient.get<any[]>(`/communication/conversations?tenantId=${school.id}&userId=${user.id}`);
      if (res.ok && res.data) setConversations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (convId: string) => {
    if (!school?.id) return;
    try {
      const res = await apiClient.get<any[]>(`/communication/conversations/${convId}/messages?tenantId=${school.id}`);
      if (res.ok && res.data) setMessages(res.data);
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
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Sidebar List */}
      <div className="w-1/3 border-r flex flex-col bg-gray-50/50">
        <div className="p-4 border-b bg-white flex items-center gap-2 font-semibold">
          <MessageSquare className="w-5 h-5 text-gray-500" />
          Messages
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">No conversations found.</div>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-4 border-b cursor-pointer transition-colors ${activeConvId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-100'}`}
              >
                <div className="font-semibold text-sm truncate">{conv.title || "Group Chat"}</div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  {conv.messages?.[0]?.content || "No messages yet"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Window */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConvId ? (
          <>
            {/* Header */}
            <div className="p-4 border-b bg-white flex items-center gap-3">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{activeConv?.title || "Conversation"}</div>
                <div className="text-xs text-green-600">Active now</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              {messages.map((msg, i) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border shadow-sm text-gray-800 rounded-bl-none'}`}>
                      {!isMe && <div className="text-[10px] font-semibold mb-1 text-gray-500">{msg.sender?.firstName}</div>}
                      <div className="text-sm">{msg.content}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 focus-visible:ring-blue-600"
                />
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="w-16 h-16 mb-4 text-gray-200" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
