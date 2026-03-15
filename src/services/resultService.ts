import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  ensureFirebaseAnonymousSessionIsActive,
  firestoreDatabase,
} from "@/lib/firebase";
import type { CreateOrUpdateResultPayload, ResultDocument } from "@/types/result";

export async function createResult(
  resultPayload: CreateOrUpdateResultPayload,
): Promise<void> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  const resultDocumentReference = doc(
    firestoreDatabase,
    "results",
    resultPayload.rollNo,
  );

  await setDoc(resultDocumentReference, resultPayload);
}

export async function getResultByRollNo(
  rollNo: string,
): Promise<ResultDocument | null> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  const resultDocumentReference = doc(firestoreDatabase, "results", rollNo);
  const resultDocumentSnapshot = await getDoc(resultDocumentReference);

  if (!resultDocumentSnapshot.exists()) {
    return null;
  }

  return resultDocumentSnapshot.data() as ResultDocument;
}

export async function updateResult(
  resultPayload: CreateOrUpdateResultPayload,
): Promise<void> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  const resultDocumentReference = doc(
    firestoreDatabase,
    "results",
    resultPayload.rollNo,
  );

  await updateDoc(resultDocumentReference, {
    heading: resultPayload.heading,
    subjects: resultPayload.subjects,
  });
}
