import { create } from "zustand";

export interface School {
  id: string;
  name: string;
  logo: string;
}

interface SchoolState {
  school: School | null;
  setSchool: (school: School) => void;
  clearSchool: () => void;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  school: null,
  setSchool: (school) => set({ school }),
  clearSchool: () => set({ school: null }),
}));
