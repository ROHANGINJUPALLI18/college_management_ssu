"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { ResultSubjectFields } from "@/components/result-subject-fields";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { isAdminSessionAuthenticatedInLocalStorage } from "@/lib/session";
import { useCreateStudentResultAndUpdateStudentPostingFlagMutation } from "@/store/api/portalApi";

const defaultSubjects = [
  { name: "", marks: 0 },
  { name: "", marks: 0 },
  { name: "", marks: 0 },
  { name: "", marks: 0 },
  { name: "", marks: 0 },
];

export default function AddResultPage() {
  const router = useRouter();
  const params = useParams<{ rollNo: string }>();
  const rollNo = params.rollNo;
  const [errorMessage, setErrorMessage] = useState("");
  const [subjects, setSubjects] = useState(defaultSubjects);

  const [createResult, { isLoading }] =
    useCreateStudentResultAndUpdateStudentPostingFlagMutation();

  useEffect(() => {
    if (!isAdminSessionAuthenticatedInLocalStorage()) {
      router.replace("/admin-login");
    }
  }, [router]);

  async function handlePostResultButtonClick(): Promise<void> {
    const hasIncompleteField = subjects.some(
      (subject) => !subject.name.trim() || Number.isNaN(subject.marks),
    );
    if (hasIncompleteField) {
      setErrorMessage("All subject and marks fields are required.");
      return;
    }

    try {
      await createResult({ rollNo, subjects }).unwrap();
      router.push("/admin/students");
    } catch (error) {
      setErrorMessage(
        (error as { error?: string })?.error ?? "Unable to post result.",
      );
    }
  }

  return (
    <main className="w-full px-4 py-8 md:pl-80 md:pr-8">
      <Sidebar activePath="students" />

      <div className="mx-auto  w-3/4 mt-3 max-w-5xl">
        <Card>
          <CardTitle>Add Result - {rollNo}</CardTitle>
          <div className="mt-4">
            <ResultSubjectFields
              subjects={subjects}
              onSubjectNameChange={(subjectIndex, name) => {
                setSubjects((currentSubjects) => {
                  const updatedSubjects = [...currentSubjects];
                  updatedSubjects[subjectIndex] = {
                    ...updatedSubjects[subjectIndex],
                    name,
                  };
                  return updatedSubjects;
                });
              }}
              onSubjectMarksChange={(subjectIndex, marks) => {
                setSubjects((currentSubjects) => {
                  const updatedSubjects = [...currentSubjects];
                  updatedSubjects[subjectIndex] = {
                    ...updatedSubjects[subjectIndex],
                    marks,
                  };
                  return updatedSubjects;
                });
              }}
            />
          </div>

          {errorMessage ? (
            <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
          ) : null}
          <div className="flex justify-center">
          <Button
            className="mt-4"
            disabled={isLoading}
            onClick={handlePostResultButtonClick}
          >
            {isLoading ? "Posting..." : "Post Result"}
          </Button>
        </div>
        </Card>
      </div>
    </main>
  );
}
