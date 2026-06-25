import React from "react";
import FormHeader from "../formHeader";

export default function BulkStudentForm() {
  return (
    <div className="max-w-4xl mx-auto bg-card p-6 rounded-lg shadow-sm border mt-6">
      <FormHeader title="Bulk Student Admission" />
      <div className="py-8 text-center text-muted-foreground border-2 border-dashed rounded-md">
        <p>Drag and drop CSV file here, or click to upload</p>
      </div>
    </div>
  );
}
