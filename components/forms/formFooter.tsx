import React from "react";
import { Button } from "@/components/ui/button";

type FormFooterProps = {
  submitButtonText: string;
};

export default function FormFooter({ submitButtonText }: FormFooterProps) {
  return (
    <div className="mt-8 flex items-center justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
      <Button type="button" variant="outline" className="mr-4">
        Cancel
      </Button>
      <Button type="submit">
        {submitButtonText}
      </Button>
    </div>
  );
}
