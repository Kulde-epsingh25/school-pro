/**
 * Generates an automated student registration number.
 * 
 * @param schoolCode The school code (e.g., "BU").
 * @param sponsorshipType Sponsorship type: "PS" (Private) or "SS" (Sponsored).
 * @param year Registration year (defaults to current year).
 * @param sequence Current sequence number.
 * @returns A formatted registration number string (e.g., "BU-PS-2024-001").
 */
export function generateRegistrationNumber(
  schoolCode: string = "BU",
  sponsorshipType: "PS" | "SS" = "PS",
  year: number = new Date().getFullYear(),
  sequence: number
): string {
  // Pad the sequence number with leading zeros (e.g., 001)
  const paddedSequence = sequence.toString().padStart(3, "0");
  return `${schoolCode}-${sponsorshipType}-${year}-${paddedSequence}`;
}

/**
 * Generates a Roll (RO) Number.
 * Currently uses a simple timestamp-based format as a placeholder.
 * 
 * @returns A unique roll number string.
 */
export function generateRollNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `RO-${timestamp}-${randomSuffix}`;
}

/**
 * Generates an automated Employee ID.
 * 
 * @param schoolPrefix The school prefix (e.g., "SP" for School Pro).
 * @param sequence Current sequence number.
 * @returns A formatted employee ID string (e.g., "SP-EMP-001").
 */
export function generateEmployeeId(
  schoolPrefix: string = "SP",
  sequence: number
): string {
  const paddedSequence = sequence.toString().padStart(3, "0");
  return `${schoolPrefix}-EMP-${paddedSequence}`;
}
