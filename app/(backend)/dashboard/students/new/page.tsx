import SingleStudentForm from "@/components/forms/students/singleStudentForm";
import BulkStudentForm from "@/components/forms/students/bulkStudentForm";
import InfoBanner from "@/components/infoBanner";

export default function NewStudentPage() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">New Students</h2>
      <InfoBanner 
        type="warning" 
        message="Please first create the parent, class and stream for this student" 
      />
      
      <SingleStudentForm />
      
      <div className="mt-12">
        <BulkStudentForm />
      </div>
    </div>
  );
}
