import React from "react";

type FormHeaderProps = {
  title: string;
};

export default function FormHeader({ title }: FormHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <hr className="mt-2 mb-4 border-gray-200 dark:border-gray-700" />
    </div>
  );
}
