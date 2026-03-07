import type { StudentDocument } from "@/types/student";

const STUDENT_SESSION_KEY = "student_result_portal_student_session";
const ADMIN_SESSION_KEY = "student_result_portal_admin_session";

export function saveStudentSessionInLocalStorage(student: StudentDocument): void {
  localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(student));
}

export function getStudentSessionFromLocalStorage(): StudentDocument | null {
  const rawSession = localStorage.getItem(STUDENT_SESSION_KEY);
  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession) as StudentDocument;
  } catch {
    return null;
  }
}

export function clearStudentSessionFromLocalStorage(): void {
  localStorage.removeItem(STUDENT_SESSION_KEY);
}

export function saveAdminSessionInLocalStorage(): void {
  localStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
}

export function isAdminSessionAuthenticatedInLocalStorage(): boolean {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "authenticated";
}

export function clearAdminSessionFromLocalStorage(): void {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}
