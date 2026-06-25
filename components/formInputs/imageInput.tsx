import React from "react";
import { Input } from "@/components/ui/input";

type ImageInputProps = {
  label: string;
  name: string;
};

export default function ImageInput({ label, name }: ImageInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <Input 
          type="file" 
          accept="image/*" 
          className="file:text-foreground file:bg-muted file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md cursor-pointer" 
          id={name}
          name={name} 
        />
      </div>
    </div>
  );
}
