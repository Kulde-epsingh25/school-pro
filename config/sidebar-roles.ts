import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  Briefcase,
  Megaphone,
  Building,
  CalendarDays,
  Shield,
  Bus,
  ClipboardList,
  Coffee,
  Wrench,
  UserCheck,
  FileText,
  MessageSquare,
  HelpCircle,
  FolderOpen,
  Clock,
  Ticket
} from "lucide-react";

export const adminSidebar = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Overview", url: "/admin" },
      { title: "Analytics", url: "/admin/analytics" },
    ],
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
    items: [
      { title: "Students", url: "/admin/users/students" },
      { title: "Teachers", url: "/admin/users/teachers" },
      { title: "Parents", url: "/admin/users/parents" },
      { title: "Support Staff", url: "/admin/users/staff" },
    ],
  },
  {
    title: "Academics",
    url: "/admin/academics",
    icon: GraduationCap,
    items: [
      { title: "Classes & Sections", url: "/admin/academics/classes" },
      { title: "Subjects", url: "/admin/academics/subjects" },
      { title: "Examinations", url: "/admin/academics/exams" },
    ],
  },
  {
    title: "Finance & Billing",
    url: "/admin/finance",
    icon: DollarSign,
    items: [
      { title: "Fee Collection", url: "/admin/finance/fees" },
      { title: "Payroll", url: "/admin/finance/payroll" },
      { title: "Expenses", url: "/admin/finance/expenses" },
    ],
  },
  {
    title: "Communication",
    url: "/admin/communication",
    icon: Megaphone,
    items: [
      { title: "Announcements", url: "/admin/communication/announcements" },
      { title: "Send SMS/Email", url: "/admin/communication/messages" },
    ],
  },
  {
    title: "Facilities",
    url: "/admin/facilities",
    icon: Building,
    items: [
      { title: "Transport", url: "/admin/facilities/transport" },
      { title: "Inventory", url: "/admin/facilities/inventory" },
      { title: "Clubs & Events", url: "/admin/facilities/events" },
    ],
  },
];

export const teacherSidebar = [
  {
    title: "Dashboard",
    url: "/teacher",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "My Schedule", url: "/teacher" },
    ],
  },
  {
    title: "My Classes",
    url: "/teacher/classes",
    icon: BookOpen,
    items: [
      { title: "Attendance", url: "/teacher/classes/attendance" },
      { title: "Gradebook", url: "/teacher/classes/grades" },
      { title: "Assignments", url: "/teacher/classes/assignments" },
    ],
  },
  {
    title: "Resources",
    url: "/teacher/resources",
    icon: FolderOpen,
    items: [
      { title: "Study Materials", url: "/teacher/resources/materials" },
      { title: "Syllabus", url: "/teacher/resources/syllabus" },
    ],
  },
  {
    title: "Communication",
    url: "/teacher/communication",
    icon: MessageSquare,
    items: [
      { title: "Student Chat", url: "/teacher/communication/students" },
      { title: "Parent Chat", url: "/teacher/communication/parents" },
    ],
  },
  {
    title: "Leave & HR",
    url: "/teacher/leave",
    icon: Briefcase,
    items: [
      { title: "Apply Leave", url: "/teacher/leave/apply" },
      { title: "Leave History", url: "/teacher/leave/history" },
    ],
  },
];

export const studentSidebar = [
  {
    title: "Dashboard",
    url: "/student",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Timetable", url: "/student" },
      { title: "My Profile", url: "/student/profile" },
    ],
  },
  {
    title: "Academics",
    url: "/student/academics",
    icon: GraduationCap,
    items: [
      { title: "Assignments", url: "/student/academics/assignments" },
      { title: "Report Cards", url: "/student/academics/reports" },
      { title: "Attendance", url: "/student/academics/attendance" },
    ],
  },
  {
    title: "Library & Clubs",
    url: "/student/library",
    icon: BookOpen,
    items: [
      { title: "E-Resources", url: "/student/library/resources" },
      { title: "My Clubs", url: "/student/library/clubs" },
    ],
  },
  {
    title: "Financials",
    url: "/student/finance",
    icon: DollarSign,
    items: [
      { title: "Fee Status", url: "/student/finance/fees" },
      { title: "Receipts", url: "/student/finance/receipts" },
    ],
  },
  {
    title: "Helpdesk",
    url: "/student/helpdesk",
    icon: HelpCircle,
    items: [
      { title: "Raise Ticket", url: "/student/helpdesk/ticket" },
    ],
  },
];

export const maintenanceSidebar = [
  {
    title: "Dashboard",
    url: "/maintenance",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "Today's Tasks", url: "/maintenance" },
    ],
  },
  {
    title: "Cleaning Tasks",
    url: "/maintenance/tasks",
    icon: ClipboardList,
    items: [
      { title: "Schedule", url: "/maintenance/tasks/schedule" },
      { title: "Log Completion", url: "/maintenance/tasks/log" },
    ],
  },
  {
    title: "Issues & Inventory",
    url: "/maintenance/issues",
    icon: Wrench,
    items: [
      { title: "Report Issue", url: "/maintenance/issues/report" },
      { title: "Request Supplies", url: "/maintenance/issues/supplies" },
    ],
  },
];

export const transportSidebar = [
  {
    title: "Dashboard",
    url: "/transport",
    icon: LayoutDashboard,
    isActive: true,
    items: [
      { title: "My Route", url: "/transport" },
    ],
  },
  {
    title: "Trips & Logs",
    url: "/transport/trips",
    icon: Bus,
    items: [
      { title: "Student Manifest", url: "/transport/trips/manifest" },
      { title: "Vehicle Logs", url: "/transport/trips/logs" },
    ],
  },
];

export const securitySidebar = [
  {
    title: "Dashboard",
    url: "/security",
    icon: Shield,
    isActive: true,
    items: [
      { title: "Live Desk", url: "/security" },
    ],
  },
  {
    title: "Visitor Management",
    url: "/security/visitors",
    icon: UserCheck,
    items: [
      { title: "Log Visitor", url: "/security/visitors/log" },
      { title: "Active Passes", url: "/security/visitors/passes" },
    ],
  },
  {
    title: "Emergencies",
    url: "/security/emergencies",
    icon: Megaphone,
    items: [
      { title: "SOS Alerts", url: "/security/emergencies/alerts" },
      { title: "Incident Reports", url: "/security/emergencies/reports" },
    ],
  },
];
