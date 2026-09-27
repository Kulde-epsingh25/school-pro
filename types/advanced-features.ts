// Advanced Feature Domain Types for School Pro v2.0 Enterprise

export type AdmissionStage = 
  | "INQUIRY" 
  | "DOCUMENT_VERIFICATION" 
  | "ENTRANCE_ASSESSMENT" 
  | "INTERVIEW_SCHEDULED" 
  | "OFFER_MADE" 
  | "ENROLLED" 
  | "WAITLISTED" 
  | "REJECTED";

export interface AdmissionApplication {
  id: string;
  tenantId: string;
  applicationNumber: string;
  studentName: string;
  applyingForGrade: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  stage: AdmissionStage;
  submissionDate: string;
  assessmentScore?: number;
  interviewDate?: string;
  notes?: string;
  documents: {
    name: string;
    status: "PENDING" | "VERIFIED" | "REJECTED";
    fileUrl?: string;
  }[];
  assignedCounselor?: string;
  priority: "HIGH" | "MEDIUM" | "STANDARD";
}

export type RiskSeverity = "CRITICAL" | "HIGH" | "MODERATE" | "STABLE" | "THRIVING";

export interface AtRiskStudentAlert {
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  attendanceRate: number; // percentage (e.g. 74.5)
  currentGpa: number; // e.g. 2.1
  failingSubjectsCount: number;
  missingAssignmentsCount: number;
  behavioralIncidentsCount: number;
  compositeRiskScore: number; // 0 to 100 (higher = greater risk)
  severity: RiskSeverity;
  primaryRiskDrivers: string[];
  recommendedInterventions: string[];
  lastInterventionDate?: string;
  mentorTeacherName: string;
}

export type LessonPlanStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REVISION_REQUESTED";

export interface LessonPlan {
  id: string;
  tenantId: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  grade: string;
  title: string;
  unitTopic: string;
  academicWeek: number;
  startDate: string;
  endDate: string;
  learningObjectives: string[];
  materialsRequired: string[];
  pedagogyStrategy: string;
  assessmentMethod: string;
  curriculumStandards: string[]; // e.g., ["CCSS.MATH.8.EE.1", "IB.MYP.SCI.A"]
  status: LessonPlanStatus;
  reviewerFeedback?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface ClinicVisit {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  grade: string;
  timestamp: string;
  chiefComplaint: string;
  temperatureCelsius?: number;
  bloodPressure?: string;
  treatmentProvided: string;
  medicationAdministered?: string;
  outcome: "RETURNED_TO_CLASS" | "SENT_HOME" | "EMERGENCY_TRANSFER" | "PARENT_PICKUP";
  attendingNurseName: string;
  parentNotified: boolean;
  notes?: string;
}

export interface MedicalAlert {
  id: string;
  studentId: string;
  studentName: string;
  grade: string;
  alertType: "ALLERGY" | "CHRONIC_CONDITION" | "MEDICATION" | "DIETARY";
  severity: "MILD" | "MODERATE" | "SEVERE_ANAPHYLAXIS";
  description: string;
  actionProtocol: string; // e.g. "Administer EpiPen in main office; call 911 immediately"
  emergencyContact: string;
}

export interface CounselingSession {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  grade: string;
  sessionDate: string;
  counselorId: string;
  counselorName: string;
  category: "ACADEMIC_ANXIETY" | "BEHAVIORAL" | "FAMILY_SUPPORT" | "PEER_CONFLICT" | "CAREER_GUIDANCE";
  confidentialityLevel: "STRICT_RESTRICTED" | "FACULTY_SHARED";
  summary: string;
  actionPlan: string;
  followUpDate?: string;
  auditAccessLogs: {
    accessedBy: string;
    accessedAt: string;
    reason: string;
  }[];
}

export interface InventoryItem {
  id: string;
  tenantId: string;
  assetTag: string;
  name: string;
  category: "IT_HARDWARE" | "LAB_EQUIPMENT" | "FURNITURE" | "VEHICLES" | "ATHLETICS";
  purchaseDate: string;
  purchaseCost: number;
  usefulLifeYears: number;
  salvageValue: number;
  currentDepreciatedValue: number;
  depreciationMethod: "STRAIGHT_LINE" | "DECLINING_BALANCE";
  location: string;
  condition: "EXCELLENT" | "GOOD" | "NEEDS_REPAIR" | "DECOMMISSIONED";
  assignedTo?: string;
}

export type POStatus = "DRAFT" | "SUBMITTED" | "BURSAR_APPROVED" | "PRINCIPAL_APPROVED" | "ORDERED" | "RECEIVED" | "REJECTED";

export interface PurchaseOrder {
  id: string;
  tenantId: string;
  poNumber: string;
  vendorName: string;
  vendorContact: string;
  department: string;
  requestedBy: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  status: POStatus;
  createdAt: string;
  requiredApprovalLevel: "BURSAR_ONLY" | "PRINCIPAL_REQUIRED" | "BOARD_REQUIRED";
  approvalHistory: {
    role: string;
    approverName: string;
    decision: "APPROVED" | "REJECTED";
    comments?: string;
    date: string;
  }[];
}

export interface DelegatedAccessGrant {
  id: string;
  tenantId: string;
  grantedToUserId: string;
  grantedToUserName: string;
  elevatedRole: string; // e.g., "acting_principal", "acting_bursar"
  justification: string;
  approvedByUserId: string;
  approvedByUserName: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  revokedAt?: string;
  allowedActions: string[];
}
