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

export function ParentDetails() {
  const { control, watch, setValue } = useFormContext();

  const sameAsStudentAddress = watch("sameAsStudentAddress");
  const studentAddress = watch("addressLine1");

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("sameAsStudentAddress", e.target.checked);
    if (e.target.checked) {
      setValue("parentAddress", studentAddress || "");
    } else {
      setValue("parentAddress", "");
    }
  };


  return (

    <div>
      <h3 className="text-lg font-medium mb-4">Parent Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="parentFirstName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Parent Name <span className="text-red-500">*</span></FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="First Name" {...field} />
                </FormControl>
              </div>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="parentLastName"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>&nbsp;</FormLabel>
              <FormControl>
                <Input placeholder="Last Name" {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="relation"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Relation</FormLabel>
              <FormControl>
                <select className={selectClassName} {...field}>
                  <option value="">-Select-</option>
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                </select>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="occupation"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Occupation</FormLabel>
              <FormControl>
                <Input placeholder="Engineer" {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="parentEmail"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="flex items-center justify-center px-3 border border-r-0 border-input rounded-l-lg bg-muted text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                  </div>
                  <Input placeholder="parent@example.com" type="email" className="rounded-l-none" {...field} />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="parentPhone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+1 201-555-0123" {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="parentMobile"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Mobile No</FormLabel>
              <FormControl>
                <Input placeholder="+1 201-555-0123" {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />

        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            id="sameAsStudent"
            className="w-4 h-4 rounded border-input"
            checked={sameAsStudentAddress}
            onChange={handleCheckboxChange}
          />
          <label htmlFor="sameAsStudent" className="text-sm cursor-pointer">
            Address same as Student Address
          </label>
        </div>

        <FormField
          control={control}
          name="parentAddress"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2 lg:col-span-3 space-y-2">
              <FormLabel>Parent Address <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Address Line 1" {...field} disabled={sameAsStudentAddress} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
