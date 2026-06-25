"use client";
import { useState } from "react";
import { X } from "lucide-react";

type InfoBannerProps = {
  message: string;
  type?: "info" | "success" | "warning" | "danger";
};

export default function InfoBanner({ message, type = "info" }: InfoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  // Determine background color based on the type
  const typeColors = {
    info: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
    danger: "bg-red-100 text-red-800",
  };

  return (
    <div className={`flex items-center justify-between py-2 px-4 mb-3 max-w-3xl mx-auto rounded-md ${typeColors[type]}`}>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={() => setIsVisible(false)} className="text-gray-500 hover:text-gray-700">
        <X size={16} />
      </button>
    </div>
  );
}
