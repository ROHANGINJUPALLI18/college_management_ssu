import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ensureFirebaseAnonymousSessionIsActive,
  firestoreDatabase,
} from "@/lib/firebase";
import type {
  CreateStudentPayload,
  StudentDocument,
  StudentLoginPayload,
} from "@/types/student";

function getStudentsCollectionReferenceOrThrowConfigurationError() {
  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  return collection(firestoreDatabase, "students");
}

export async function getStudents(): Promise<StudentDocument[]> {
  await ensureFirebaseAnonymousSessionIsActive();
  const studentsCollectionReference = getStudentsCollectionReferenceOrThrowConfigurationError();
  const studentSnapshot = await getDocs(studentsCollectionReference);
  return studentSnapshot.docs.map((singleStudentDocument) => {
    return singleStudentDocument.data() as StudentDocument;
  });
}

export async function getStudentByRollNo(
  rollNo: string,
): Promise<StudentDocument | null> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  const studentDocumentReference = doc(firestoreDatabase, "students", rollNo);
  const studentDocumentSnapshot = await getDoc(studentDocumentReference);

  if (!studentDocumentSnapshot.exists()) {
    return null;
  }

  return studentDocumentSnapshot.data() as StudentDocument;
}

export async function createStudent(
  studentPayload: CreateStudentPayload,
): Promise<void> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  const studentDocumentReference = doc(
    firestoreDatabase,
    "students",
    studentPayload.rollNo,
  );

  await setDoc(studentDocumentReference, {
    ...studentPayload,
    resultPosted: false,
    createdAt: new Date().toISOString(),
  });
}

export async function updateStudent(
  rollNo: string,
  updatedStudentData: Partial<StudentDocument>,
): Promise<void> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  const studentDocumentReference = doc(firestoreDatabase, "students", rollNo);
  await updateDoc(studentDocumentReference, updatedStudentData);
}

export async function authenticateStudentUsingRollNumberAndDateOfBirth(
  loginPayload: StudentLoginPayload,
): Promise<StudentDocument | null> {
  await ensureFirebaseAnonymousSessionIsActive();

  const studentsCollectionReference = getStudentsCollectionReferenceOrThrowConfigurationError();
  const studentQuery = query(
    studentsCollectionReference,
    where("rollNo", "==", loginPayload.rollNo),
    where("dob", "==", loginPayload.dob),
  );

  const studentQuerySnapshot = await getDocs(studentQuery);

  if (studentQuerySnapshot.empty) {
    return null;
  }

  return studentQuerySnapshot.docs[0].data() as StudentDocument;
}
