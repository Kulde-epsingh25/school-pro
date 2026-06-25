import React from "react";

type Option = {
  label: string;
  value: string;
};

type FormSelectProps = {
  label: string;
  name: string;
  options: Option[];
  isSearchable?: boolean;
};

export default function FormSelect({
  label,
  name,
  options = [],
  isSearchable,
}: FormSelectProps) {
  const selectClassName =
    "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <select id={name} name={name} className={selectClassName}>
        <option value="">-Select-</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
