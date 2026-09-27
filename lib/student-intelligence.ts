// Student Intelligence Engine: At-Risk Predictive Analytics & Performance Modeling
import { AtRiskStudentAlert, RiskSeverity } from "@/types/advanced-features";

export interface StudentPerformanceInput {
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  attendancePercentage: number;
  currentGpa: number; // 0.0 - 4.0 scale
  failingSubjectsCount: number;
  missingAssignmentsCount: number;
  behavioralIncidentsCount: number;
  mentorTeacherName: string;
  lastInterventionDate?: string;
}

/**
 * Calculates a multi-variate composite risk score (0 to 100)
 * Higher score indicates higher probability of academic probation or drop-out.
 */
export function evaluateStudentRisk(input: StudentPerformanceInput): AtRiskStudentAlert {
  const drivers: string[] = [];
  const interventions: string[] = [];
  let score = 0;

  // 1. Attendance Weight (Max 35 points)
  if (input.attendancePercentage < 70) {
    score += 35;
    drivers.push(`Severe Chronic Absenteeism (${input.attendancePercentage}% attendance)`);
    interventions.push("Issue formal attendance warning and summon mandatory parent conference.");
    interventions.push("Deploy school social worker / counselor for home engagement check.");
  } else if (input.attendancePercentage < 80) {
    score += 25;
    drivers.push(`Moderate Absenteeism (${input.attendancePercentage}% attendance)`);
    interventions.push("Enroll in attendance tracking buddy program.");
  } else if (input.attendancePercentage < 90) {
    score += 10;
    drivers.push(`Irregular Attendance (${input.attendancePercentage}% attendance)`);
  }

  // 2. GPA & Failing Grades Weight (Max 40 points)
  if (input.currentGpa < 1.8) {
    score += 25;
    drivers.push(`Critical GPA Level (${input.currentGpa.toFixed(2)} / 4.0)`);
    interventions.push("Assign daily after-school academic intervention and peer tutor.");
  } else if (input.currentGpa < 2.5) {
    score += 15;
    drivers.push(`Sub-par GPA Level (${input.currentGpa.toFixed(2)} / 4.0)`);
    interventions.push("Provide targeted study-skills workshop.");
  }

  if (input.failingSubjectsCount >= 3) {
    score += 15;
    drivers.push(`Failing multiple core courses (${input.failingSubjectsCount} subjects)`);
    interventions.push("Schedule immediate Academic Review Board consultation.");
  } else if (input.failingSubjectsCount >= 1) {
    score += 8;
    drivers.push(`Failing ${input.failingSubjectsCount} subject(s)`);
    interventions.push("Notify department head for subject-specific remedial worksheets.");
  }

  // 3. Missing Work / Engagement Weight (Max 15 points)
  if (input.missingAssignmentsCount >= 5) {
    score += 15;
    drivers.push(`Severe assignment backlog (${input.missingAssignmentsCount} missing assignments)`);
    interventions.push("Initiate academic catch-up contract with weekly milestone checkpoints.");
  } else if (input.missingAssignmentsCount >= 2) {
    score += 8;
    drivers.push(`${input.missingAssignmentsCount} overdue/missing assignments`);
  }

  // 4. Behavioral Indicators Weight (Max 10 points)
  if (input.behavioralIncidentsCount >= 3) {
    score += 10;
    drivers.push(`Repetitive disciplinary infractions (${input.behavioralIncidentsCount} recorded incidents)`);
    interventions.push("Refer to student wellness & counseling center for behavioral support.");
  } else if (input.behavioralIncidentsCount >= 1) {
    score += 5;
    drivers.push(`${input.behavioralIncidentsCount} disciplinary note(s)`);
  }

  // Cap score at 100
  const finalScore = Math.min(100, Math.round(score));

  // Determine Severity Level
  let severity: RiskSeverity = "THRIVING";
  if (finalScore >= 70) {
    severity = "CRITICAL";
  } else if (finalScore >= 50) {
    severity = "HIGH";
  } else if (finalScore >= 30) {
    severity = "MODERATE";
  } else if (finalScore >= 15) {
    severity = "STABLE";
  } else {
    severity = "THRIVING";
  }

  if (interventions.length === 0) {
    interventions.push("Continue standard monitoring and positive reinforcement.");
  }

  return {
    studentId: input.studentId,
    studentName: input.studentName,
    grade: input.grade,
    section: input.section,
    attendanceRate: input.attendancePercentage,
    currentGpa: input.currentGpa,
    failingSubjectsCount: input.failingSubjectsCount,
    missingAssignmentsCount: input.missingAssignmentsCount,
    behavioralIncidentsCount: input.behavioralIncidentsCount,
    compositeRiskScore: finalScore,
    severity,
    primaryRiskDrivers: drivers.length > 0 ? drivers : ["Performance meets or exceeds benchmarks"],
    recommendedInterventions: interventions,
    lastInterventionDate: input.lastInterventionDate,
    mentorTeacherName: input.mentorTeacherName,
  };
}

/**
 * Calculates grade distribution analytics (Mean, Median, Standard Deviation)
 */
export function calculateGradebookStats(scores: number[]) {
  if (scores.length === 0) {
    return { count: 0, mean: 0, median: 0, stdDev: 0, passingRate: 0 };
  }

  const sorted = [...scores].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, curr) => acc + curr, 0);
  const mean = sum / sorted.length;

  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  const variance =
    sorted.reduce((acc, curr) => acc + Math.pow(curr - mean, 2), 0) / sorted.length;
  const stdDev = Math.sqrt(variance);

  const passingCount = sorted.filter((score) => score >= 60).length;
  const passingRate = Math.round((passingCount / sorted.length) * 100);

  return {
    count: sorted.length,
    mean: Number(mean.toFixed(1)),
    median: Number(median.toFixed(1)),
    stdDev: Number(stdDev.toFixed(1)),
    passingRate,
  };
}
