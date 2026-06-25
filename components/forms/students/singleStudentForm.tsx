import FormHeader from "../formHeader";
import FormFooter from "../formFooter";
import TextInput from "@/components/formInputs/textInput";
import FormSelect from "@/components/formInputs/formSelect";
import ImageInput from "@/components/formInputs/imageInput";

export default function SingleStudentForm() {
  const parents = [
    { label: "John Doe", value: "john_doe" },
    { label: "Jane Smith", value: "jane_smith" },
  ];
  const classes = [
    { label: "Class 5", value: "class_5" },
    { label: "Class 6", value: "class_6" },
  ];
  const streams = [
    { label: "5A", value: "5a" },
    { label: "5B", value: "5b" },
  ];
  const genders = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Other", value: "other" },
  ];
  const countries = [
    { label: "United States", value: "us" },
    { label: "Canada", value: "ca" },
    { label: "United Kingdom", value: "uk" },
  ];
  const religions = [
    { label: "Christianity", value: "christianity" },
    { label: "Islam", value: "islam" },
    { label: "Hinduism", value: "hinduism" },
    { label: "Buddhism", value: "buddhism" },
    { label: "Other", value: "other" },
  ];

  return (
    <form className="max-w-4xl mx-auto bg-card p-6 rounded-lg shadow-sm border mt-6">
      <FormHeader title="Single Student Admission" />

      {/* 3-Column Grid for basic info */}
      <div className="grid md:grid-cols-3 gap-3 mb-3">
         <TextInput label="First Name" name="firstName" />
         <TextInput label="Last Name" name="lastName" />
         <TextInput label="Email" name="email" type="email" />
      </div>

      {/* 2-Column Grid for other details */}
      <div className="grid md:grid-cols-2 gap-3 space-y-3">
         <TextInput label="Date of Birth" name="dob" type="date" />
         <TextInput label="Password" name="password" type="password" />

         {/* Select Inputs for relational data */}
         <FormSelect label="Parent" name="parent" options={parents} isSearchable={true} />
         <FormSelect label="Class" name="class" options={classes} />
         <FormSelect label="Stream" name="stream" options={streams} />

         {/* Biographical details */}
         <FormSelect label="Gender" name="gender" options={genders} isSearchable={false} />
         <FormSelect label="Nationality" name="nationality" options={countries} />
         <FormSelect label="Religion" name="religion" options={religions} />
         <TextInput label="Phone" name="phone" type="tel" />
      </div>

      {/* Image input for student avatar */}
      <div className="flex justify-center mt-6">
         <ImageInput label="Student Profile Image" name="imageUrl" />
      </div>

      <FormFooter submitButtonText="Save Student" />
    </form>
  );
}
