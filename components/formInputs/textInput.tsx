import React from "react";
import { Input } from "@/components/ui/input";

type TextInputProps = {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "date" | "tel";
  placeholder?: string;
};

export default function TextInput({
  label,
  name,
  type = "text",
  placeholder,
}: TextInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
}
