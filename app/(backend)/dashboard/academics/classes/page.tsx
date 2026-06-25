"use client";
import { useState } from "react";
import { GraduationCap, Plus, Search, Pencil, Trash2, Users, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ClassListing() {
  const [selectedClass, setSelectedClass] = useState<string>("Class 5");

  const classes = [
    { name: "Class 5", sections: 3, students: 120 },
    { name: "Class 6", sections: 2, students: 80 },
    { name: "Class 7", sections: 4, students: 160 },
    { name: "Class 8", sections: 3, students: 115 },
    { name: "Class 9", sections: 2, students: 75 },
  ];

  const sectionsData = {
    "Class 5": [
      { name: "5A", teacher: "Ms. Sarah", students: 40 },
      { name: "5B", teacher: "Mr. John", students: 38 },
      { name: "5C", teacher: "Ms. Emily", students: 42 },
    ]
  };

  const sections = sectionsData[selectedClass as keyof typeof sectionsData] || [];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Left Pane: List of Classes */}
      <div className="w-80 border-r border-gray-100 flex flex-col h-full bg-white">
        <div className="p-4 border-b border-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-gray-700" />
              <h2 className="text-xl font-bold text-gray-900">Classes</h2>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search classes..." className="pl-9 bg-gray-50/50 border-gray-200" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {classes.map((cls) => (
            <div
              key={cls.name}
              onClick={() => setSelectedClass(cls.name)}
              className={`p-3 rounded-xl cursor-pointer border ${
                selectedClass === cls.name 
                  ? "bg-gray-50 border-gray-100" 
                  : "border-transparent hover:bg-gray-50/50"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{cls.name}</span>
                  <span className="text-sm text-gray-500">{cls.sections} sections</span>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 gap-1.5">
                <Users className="w-4 h-4" />
                <span>{cls.students} students</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Pane: Streams/Sections for the selected class */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {selectedClass ? (
          <>
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 text-gray-600">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClass}</h2>
                </div>
                <p className="text-sm text-gray-500 ml-9">Classes / {selectedClass}</p>
              </div>
              
              <Button variant="outline" className="border-gray-200 text-gray-700 font-medium h-9">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {sections.map((section) => (
                   <div key={section.name} className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
                     <div className="flex justify-between items-start mb-4">
                       <h3 className="text-xl font-bold text-gray-900">{section.name}</h3>
                       <div className="flex gap-1">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-700">
                           <Pencil className="h-4 w-4" />
                         </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600">
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                     <p className="text-sm text-gray-600 mb-3 font-medium">Class Teacher: {section.teacher}</p>
                     <div className="flex items-center text-sm text-gray-500 gap-2">
                       <Users className="w-4 h-4" />
                       <span>{section.students} students</span>
                     </div>
                   </div>
                 ))}
                 
                 {sections.length === 0 && (
                   <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                     <p className="text-gray-500">No sections found for {selectedClass}.</p>
                   </div>
                 )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500 bg-gray-50/30">
            Please select a class from the left to view its sections.
          </div>
        )}
      </div>
    </div>
  );
}
