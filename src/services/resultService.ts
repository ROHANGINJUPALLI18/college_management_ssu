import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  ensureFirebaseAnonymousSessionIsActive,
  firestoreDatabase,
} from "@/lib/firebase";
import type {
  CreateOrUpdateResultPayload,
  ResultDocument,
  UpdateResultPayload,
} from "@/types/result";

export async function createResult(
  resultPayload: CreateOrUpdateResultPayload,
): Promise<void> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  const resultsCollectionReference = collection(firestoreDatabase, "results");

  await addDoc(resultsCollectionReference, {
    ...resultPayload,
    createdAt: new Date().toISOString(),
  });
}

export async function getResultsByRollNo(
  rollNo: string,
): Promise<ResultDocument[]> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  const resultsCollectionReference = collection(firestoreDatabase, "results");
  const studentResultsQuery = query(
    resultsCollectionReference,
    where("rollNo", "==", rollNo),
  );

  const resultQuerySnapshot = await getDocs(studentResultsQuery);

  return resultQuerySnapshot.docs
    .map((singleResultDocument) => {
      const resultData = singleResultDocument.data() as Omit<ResultDocument, "id">;
      return {
        id: singleResultDocument.id,
        ...resultData,
      };
    })
    .sort((firstResult, secondResult) => {
      const firstDateTime = firstResult.createdAt
        ? new Date(firstResult.createdAt).getTime()
        : 0;
      const secondDateTime = secondResult.createdAt
        ? new Date(secondResult.createdAt).getTime()
        : 0;
      return secondDateTime - firstDateTime;
    });
}

export async function getResultByResultId(
  resultId: string,
): Promise<ResultDocument | null> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values.");
  }

  const resultDocumentReference = doc(firestoreDatabase, "results", resultId);
  const resultDocumentSnapshot = await getDoc(resultDocumentReference);

  if (!resultDocumentSnapshot.exists()) {
    return null;
  }

  return {
    id: resultDocumentSnapshot.id,
    ...(resultDocumentSnapshot.data() as Omit<ResultDocument, "id">),
  };
}

export async function getResultByRollNo(
  rollNo: string,
): Promise<ResultDocument | null> {
  const studentResults = await getResultsByRollNo(rollNo);
  if (!studentResults.length) {
    return null;
  }

  return studentResults[0];
}

export async function updateResult(
  resultPayload: UpdateResultPayload,
): Promise<void> {
  await ensureFirebaseAnonymousSessionIsActive();

  if (!firestoreDatabase) {
    throw new Error("Firebase is not configured. Please add Firebase env values to get the accurate results.");
  }

  const resultDocumentReference = doc(firestoreDatabase, "results", resultPayload.resultId);

  await updateDoc(resultDocumentReference, {
    heading: resultPayload.heading,
    subjects: resultPayload.subjects,
  });
}
