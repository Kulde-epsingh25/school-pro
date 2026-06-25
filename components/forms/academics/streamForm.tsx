import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import TextInput from "@/components/formInputs/textInput";
import FormFooter from "../formFooter";

export type stream_props = {
  title: string;
};

export default function StreamForm() {
  return (
    <Dialog>
      <DialogTrigger className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
        <Plus size={16} className="mr-1" /> Add Section
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Stream/Section</DialogTitle>
        </DialogHeader>
        <form>
          <div className="py-4">
            <TextInput label="Stream Title" name="title" placeholder="e.g. 5A" />
          </div>
          
          <div className="mt-4">
            <FormFooter submitButtonText="Save Stream" />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
