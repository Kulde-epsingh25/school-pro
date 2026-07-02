import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, ChevronRight, SlidersHorizontal, Filter } from "lucide-react";

interface TableFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  searchPlaceholder?: string;
  dateRange?: string;
}

export function TableFilters({ search, setSearch, searchPlaceholder = "Search...", dateRange = "Lifetime" }: TableFiltersProps) {
  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <div className="relative w-72">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input 
          placeholder={searchPlaceholder} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-gray-50 border-gray-200 transition-colors focus-visible:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-3">
         <div className="border rounded-md px-3 py-2 flex items-center gap-2 text-sm text-gray-600 bg-white shadow-sm hover:bg-gray-50 transition-colors cursor-pointer">
           <Calendar className="w-4 h-4 text-gray-500" />
           <span>{dateRange}</span>
         </div>
         <Button variant="outline" size="sm" className="flex items-center gap-1 h-9 shadow-sm transition-all">
           Life time <ChevronRight className="w-4 h-4" />
         </Button>
         <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 shadow-sm transition-all">
           <Filter className="w-4 h-4" /> Filter
         </Button>
         <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 shadow-sm transition-all">
           <SlidersHorizontal className="w-4 h-4" /> View
         </Button>
      </div>
    </div>
  );
}
