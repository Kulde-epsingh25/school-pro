import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ContactDetails() {
  const { control } = useFormContext();

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Contact Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="flex items-center justify-center px-3 border border-r-0 border-input rounded-l-lg bg-muted text-muted-foreground">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <Input placeholder="student@example.com" type="email" className="rounded-l-none" {...field} />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phone"
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
          name="mobile"
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
        <FormField
          control={control}
          name="photo"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input type="file" accept="image/*" className="file:text-foreground file:bg-muted file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md cursor-pointer" {...field} value={undefined} />
                </div>
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="addressLine1"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-2 lg:col-span-3 space-y-2">
              <FormLabel>Student Address <span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Address Line 1" {...field} />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
