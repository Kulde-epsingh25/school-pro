import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const selectClassName =
  "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

export function OfficialDetails() {
  const { control } = useFormContext();

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Official Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="admissionNo"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Admission No <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="1055" {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="joiningDate"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Joining Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="rollNo"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Roll No <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="2564" {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="classApplied"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Class/Grade Applied For <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <select className={selectClassName} {...field}>
                  <option value="">Select Class</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={`Grade ${i + 1}`}>
                      Grade {i + 1}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="academicYear"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Academic Year</FormLabel>
              <FormControl>
                <Input placeholder="2023-2024" {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
