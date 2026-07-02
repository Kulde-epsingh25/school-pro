import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

export interface DetailItem {
  label: string;
  value: string | number | null | undefined;
  icon: React.ReactNode;
}

export interface UserProfile {
  name: string;
  subtext?: string;
  avatarUrl?: string;
  initials?: string;
}

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  user: UserProfile | null;
  details: DetailItem[];
  onEdit?: () => void;
  onDelete?: () => void;
}

export function UserInfoModal({ 
  isOpen, 
  onClose, 
  title = "User Information", 
  user, 
  details,
  onEdit,
  onDelete
}: UserInfoModalProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl border-0 shadow-lg sm:rounded-2xl p-0 overflow-hidden">
        <div className="bg-white px-6 py-4 flex flex-row items-center justify-between border-b">
          <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" className="flex items-center gap-1 shadow-sm" onClick={onEdit}>
                <Edit className="w-4 h-4" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" size="sm" className="flex items-center gap-1 shadow-sm bg-red-500 hover:bg-red-600" onClick={onDelete}>
                <Trash2 className="w-4 h-4" /> Delete
              </Button>
            )}
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
            <Avatar className="w-24 h-24 border-2 border-gray-50 shadow-sm">
              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} />
              <AvatarFallback className="text-3xl bg-blue-50 text-blue-700">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
              {user.subtext && <p className="text-sm text-gray-500 mt-1.5">{user.subtext}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="mt-0.5 text-gray-500">
                  {detail.icon}
                </div>
                <div>
                  <span className="font-semibold text-gray-800 text-sm">{detail.label}: </span>
                  <span className="text-gray-600 text-sm break-all">{detail.value || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
