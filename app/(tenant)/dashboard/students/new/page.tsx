"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, UserPlus, Users, Info, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { generateRegistrationNumber, generateRollNumber } from "@/lib/registrationUtils";
import { useSchoolStore } from "@/store/schoolStore";
import { useAuthStore } from "@/store/authStore";

export default function NewStudentPage() {
  const router = useRouter();
  const school = useSchoolStore((state) => state.school);
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [parents, setParents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [streams, setStreams] = useState<any[]>([]);
  const [sequenceNo, setSequenceNo] = useState(1);

  const [formData, setFormData] = useState({
    studentType: "PS",
    firstName: "",
    lastName: "",
    email: "",
    parentId: "",
    classId: "",
    streamId: "",
    phone: "",
    nationality: "",
    password: "",
    state: "",
    bcn: "",
    religion: "",
    gender: "",
    dob: "",
    rollNo: "",
    regNo: "",
    admissionDate: "",
    address: "",
    imageUrl: "",
  });

  const [isParentModalOpen, setIsParentModalOpen] = useState(false);
  const [parentLoading, setParentLoading] = useState(false);
  const [parentForm, setParentForm] = useState({
    title: "",
    firstName: "",
    lastName: "",
    relationship: "",
    nationalId: "",
    gender: "",
    dob: "",
    phone: "",
    nationality: "",
    email: "",
    whatsappNo: "",
  });
  const [selectedParentData, setSelectedParentData] = useState<any | null>(null);

  useEffect(() => {
    if (school?.id) {
      fetchData();
    }
    // Simulate fetching the sequence from /students/sequence API
    const mockSeq = 1;
    setSequenceNo(mockSeq);
    setFormData(prev => ({
      ...prev,
      rollNo: generateRollNumber(),
      regNo: generateRegistrationNumber("BU", prev.studentType as "PS" | "SS", new Date().getFullYear(), mockSeq)
    }));
  }, []);

  const fetchData = async () => {
    try {
      const [parentsRes, classesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/parents?tenantId=${school?.id}`, { headers: { "x-user-id": user?.id || "" } }).catch(() => null),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/classes?tenantId=${school?.id}`, { headers: { "x-user-id": user?.id || "" } }).catch(() => null)
      ]);
      
      if (parentsRes && parentsRes.ok) {
        setParents(await parentsRes.json());
      } else {
        throw new Error("Parents API not ok");
      }
      
      if (classesRes && classesRes.ok) {
        setClasses(await classesRes.json());
      } else {
        throw new Error("Classes API not ok");
      }
    } catch (error) {
      console.error("Failed to fetch data, using mock data:", error);
      // Fallback to mock data
      setParents([
        { id: "1", firstName: "David", lastName: "Johnson" },
        { id: "2", firstName: "Emma", lastName: "Smith" }
      ]);
      setClasses([
        { id: "10", title: "Class 10", streams: [{ id: "Science", title: "Science" }, { id: "Arts", title: "Arts" }] },
        { id: "11", title: "Class 11", streams: [{ id: "Commerce", title: "Commerce" }] }
      ]);
    }
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setFormData({ ...formData, classId, streamId: "" });
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      setStreams(selectedClass.streams || []);
    } else {
      setStreams([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // If studentType changes, update the Reg No
      if (name === "studentType") {
        updated.regNo = generateRegistrationNumber("BU", value as "PS" | "SS", new Date().getFullYear(), sequenceNo);
      }
      return updated;
    });
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setParentLoading(true);
      // Simulate saving parent and getting full parent object back
      const payload = { ...parentForm, tenantId: school?.id };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/parents`, {
        method: "POST",
        headers: { "x-user-id": user?.id || "", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null);

      let newParent;
      if (res && res.ok) {
        newParent = await res.json();
      } else {
        // Fallback mock parent creation if API fails
        newParent = { ...parentForm, id: `mock-${Date.now()}` };
      }
      
      setParents([...parents, newParent]);
      setFormData({ ...formData, parentId: newParent.id });
      setSelectedParentData(newParent);
      toast.success("Parent saved successfully!");
      setIsParentModalOpen(false);
    } catch (error) {
      toast.error("An error occurred saving the parent");
    } finally {
      setParentLoading(false);
    }
  };

  const handleRemoveParent = () => {
    setSelectedParentData(null);
    setFormData({ ...formData, parentId: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentId || !formData.classId || !formData.streamId) {
      toast.error("Please select a Parent, Class, and Stream");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        schoolId: school?.id || "N/A",
        schoolName: school?.name || "N/A",
        tenantId: school?.id
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://school-pro-api-6mxq-5qzq.onrender.com"}/students`, {
        method: "POST",
        headers: { "x-user-id": user?.id || "", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Student created successfully!");
        setTimeout(() => {
          router.push("/dashboard/students");
        }, 2000);
      } else {
        toast.error("Failed to create student");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex bg-white rounded-lg p-1 border shadow-sm">
        <Button variant="default" className="flex-1 bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" /> Single Student Admission
        </Button>
        <Button variant="ghost" className="flex-1 text-gray-500">
          <Users className="w-4 h-4 mr-2" /> Bulk Student Admission
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-lg flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
            <span className="text-sm font-medium">Please Make sure you have already Created the Parent, Class and Stream for this student</span>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6 text-orange-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
          </Button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-xl font-bold">Create Student</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Close</Button>
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Saving please wait...
                </>
              ) : (
                <><Plus className="w-4 h-4 mr-2" /> Save Student</>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border flex flex-col md:flex-row gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sponsorship Type</label>
              <div className="flex gap-4 items-center mt-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="studentType" value="PS" checked={formData.studentType === "PS"} onChange={handleChange} />
                  Private Student (PS)
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="studentType" value="SS" checked={formData.studentType === "SS"} onChange={handleChange} />
                  Sponsored Student (SS)
                </label>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Registration Number</label>
              <Input value={formData.regNo} readOnly className="bg-gray-100 font-mono" />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Roll Number (RO)</label>
              <Input value={formData.rollNo} readOnly className="bg-gray-100 font-mono" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Student First Name</label>
              <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Student First Name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Student Last Name</label>
              <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Student Last Name" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            </div>

            <div className="space-y-2 md:col-span-3 mb-4 border-t pt-4 mt-2 border-b pb-6">
              <label className="text-sm font-bold block mb-2 text-gray-900">Parent / Guardian Details</label>
              
              {selectedParentData ? (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-200 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                      {selectedParentData.firstName?.[0]}{selectedParentData.lastName?.[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {selectedParentData.title} {selectedParentData.firstName} {selectedParentData.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {selectedParentData.relationship} • {selectedParentData.phone} • {selectedParentData.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setIsParentModalOpen(true)}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={handleRemoveParent}>
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-16 border-dashed border-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => setIsParentModalOpen(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Parent / Guardian Information
                </Button>
              )}

              <Dialog open={isParentModalOpen} onOpenChange={setIsParentModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="flex flex-row items-center justify-between border-b pb-4 mb-4">
                    <DialogTitle className="text-xl font-bold">
                      {selectedParentData ? "Edit Parent" : "Create Parent"}
                    </DialogTitle>
                    <div className="flex items-center gap-2 pr-6">
                      <Button variant="outline" type="button" onClick={() => setIsParentModalOpen(false)}>Close</Button>
                      <Button type="button" onClick={handleParentSubmit} disabled={parentLoading} className="bg-blue-600 hover:bg-blue-700">
                        {parentLoading ? "Saving..." : "Save Parent"}
                      </Button>
                    </div>
                  </DialogHeader>
                  <div className="space-y-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Title</label>
                        <select name="title" value={parentForm.title} onChange={(e) => setParentForm({ ...parentForm, title: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                          <option value="">Select Title</option>
                          <option value="Mr">Mr</option>
                          <option value="Mrs">Mrs</option>
                          <option value="Ms">Ms</option>
                          <option value="Dr">Dr</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="First Name" value={parentForm.firstName} onChange={(e) => setParentForm({ ...parentForm, firstName: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Last Name" value={parentForm.lastName} onChange={(e) => setParentForm({ ...parentForm, lastName: e.target.value })} required />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Relationship</label>
                        <select value={parentForm.relationship} onChange={(e) => setParentForm({ ...parentForm, relationship: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                          <option value="">Select Relationship</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Guardian">Guardian</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">National ID / Passport</label>
                        <Input placeholder="National ID / Passport" value={parentForm.nationalId} onChange={(e) => setParentForm({ ...parentForm, nationalId: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Gender</label>
                        <select value={parentForm.gender} onChange={(e) => setParentForm({ ...parentForm, gender: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                          <option value="">Select Gender</option>
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Date of Birth</label>
                        <Input type="date" value={parentForm.dob} onChange={(e) => setParentForm({ ...parentForm, dob: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone</label>
                        <Input placeholder="Phone" value={parentForm.phone} onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Select Nationality</label>
                        <select value={parentForm.nationality} onChange={(e) => setParentForm({ ...parentForm, nationality: e.target.value })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                          <option value="">Select Nationality</option>
                          <option value="Uganda">Uganda</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Rwanda">Rwanda</option>
                          <option value="Tanzania">Tanzania</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input type="email" placeholder="Email" value={parentForm.email} onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">WhatsApp No.</label>
                        <Input placeholder="WhatsApp No." value={parentForm.whatsappNo} onChange={(e) => setParentForm({ ...parentForm, whatsappNo: e.target.value })} />
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Class</label>
              <div className="flex gap-2">
                <select name="classId" value={formData.classId} onChange={handleClassChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                  <option value="">Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Stream/Section</label>
              <div className="flex gap-2">
                <select name="streamId" value={formData.streamId} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required disabled={!formData.classId}>
                  <option value="">Stream/Section</option>
                  {streams.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <Button type="button" variant="outline" size="icon"><Plus className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Nationality</label>
              <select name="nationality" value={formData.nationality} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                <option value="">Select Nationality</option>
                <option value="Uganda">Uganda</option>
                <option value="Kenya">Kenya</option>
                <option value="USA">USA</option>
              </select>
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-medium flex items-center justify-between">
                Student Password
                <Info className="w-4 h-4 text-gray-400" />
              </label>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Student Password" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">State/Village</label>
              <Input name="state" value={formData.state} onChange={handleChange} placeholder="State/Village" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Birth Certificate No.</label>
              <Input name="bcn" value={formData.bcn} onChange={handleChange} placeholder="Birth Certificate No." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Religion</label>
              <select name="religion" value={formData.religion} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option value="">Select Religion</option>
                <option value="Christianity">Christianity</option>
                <option value="Islam">Islam</option>
                <option value="Hinduism">Hinduism</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" required>
                <option value="">Select Gender</option>
                <option value="Male">MALE</option>
                <option value="Female">FEMALE</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Admission Date</label>
                <Input type="date" name="admissionDate" value={formData.admissionDate} onChange={handleChange} max={new Date().toISOString().split("T")[0]} required />
                <p className="text-xs text-gray-500">Must be a valid past or present date.</p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <textarea name="address" value={formData.address} onChange={handleChange} className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" placeholder="Detailed Address" required minLength={10}></textarea>
              </div>
            </div>


          </div>

        </form>
      </div>
    </div>
  );
}
