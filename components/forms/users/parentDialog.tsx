"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ParentForm from "./parentForm";

export default function ParentDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" type="button" className="h-11 w-11 shrink-0 p-0 border-gray-200 bg-white text-gray-500 hover:bg-gray-50"><Plus className="h-5 w-5" /></Button>} />
      {/* We make the dialog content background transparent and padding 0 so ParentForm's native styling shines through */}
      <DialogContent className="max-w-6xl w-[90vw] p-0 border-none bg-transparent shadow-none max-h-[90vh] overflow-y-auto">
         <ParentForm />
      </DialogContent>
    </Dialog>
  );
}
