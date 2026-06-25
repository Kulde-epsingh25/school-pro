import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import TextInput from "@/components/formInputs/textInput";
import FormFooter from "../formFooter";

export type class_props = {
  title: string;
};

export default function ClassForm() {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
        <Plus size={16} className="mr-1" /> Add Class
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <form>
          {/* The class only requires a title, the slug is generated in the backend later */}
          <div className="py-4">
            <TextInput label="Class Title" name="title" placeholder="e.g. Class 5" />
          </div>
          
          <div className="mt-4">
            <FormFooter submitButtonText="Save Class" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
