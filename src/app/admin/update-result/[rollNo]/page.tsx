"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { ResultSubjectFields } from "@/components/result-subject-fields";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAdminSessionAuthenticatedInLocalStorage } from "@/lib/session";
import {
  useGetSingleStudentByRollNumberQuery,
  useGetStudentResultByRollNumberQuery,
  useUpdateStudentResultByRollNumberMutation,
} from "@/store/api/portalApi";

const defaultSubjects = [
  { name: "", marks: 0 },
  { name: "", marks: 0 },
  { name: "", marks: 0 },
  { name: "", marks: 0 },
  { name: "", marks: 0 },
];

export default function UpdateResultPage() {
  const router = useRouter();
  const params = useParams<{ rollNo: string }>();
  const rollNo = params.rollNo;
  const [errorMessage, setErrorMessage] = useState("");
  const [editedSubjects, setEditedSubjects] = useState<
    { name: string; marks: number }[] | null
  >(null);

  const { data: student } = useGetSingleStudentByRollNumberQuery(rollNo);
  const { data: existingResult } = useGetStudentResultByRollNumberQuery(rollNo);
  const [updateResult, { isLoading }] =
    useUpdateStudentResultByRollNumberMutation();

  useEffect(() => {
    if (!isAdminSessionAuthenticatedInLocalStorage()) {
      router.replace("/admin-login");
    }
  }, [router]);

  const initialSubjectsFromExistingResult = useMemo(() => {
    if (!existingResult?.subjects?.length) {
      return defaultSubjects;
    }

    const mappedSubjects = existingResult.subjects.slice(0, 5);
    while (mappedSubjects.length < 5) {
      mappedSubjects.push({ name: "", marks: 0 });
    }
    return mappedSubjects;
  }, [existingResult]);

  const subjects = editedSubjects ?? initialSubjectsFromExistingResult;

  const hasAnySubjects = useMemo(
    () => subjects.some((subject) => subject.name.trim().length > 0),
    [subjects],
  );

  async function handleUpdateResultButtonClick(): Promise<void> {
    const hasIncompleteField = subjects.some(
      (subject) => !subject.name.trim() || Number.isNaN(subject.marks),
    );

    if (hasIncompleteField) {
      setErrorMessage("All subject and marks fields are required.");
      return;
    }

    try {
      await updateResult({ rollNo, subjects }).unwrap();
      router.push("/admin/students");
    } catch (error) {
      setErrorMessage(
        (error as { error?: string })?.error ?? "Unable to update result.",
      );
    }
  }

  return (
    <main className="w-full px-4 py-8 md:pl-80 md:pr-8">
      <Sidebar activePath="students" />

      <div className="mx-auto w-3/4 mt-3 max-w-5xl">
        <Card>
          <CardTitle className="text-center" >Update Result - {rollNo}</CardTitle>
          {!hasAnySubjects ? (
            <p className="mt-3 text-sm text-[#615672]">
              Loading existing result...
            </p>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="studentName">Name</Label>
              <Input
                id="studentName"
                value={student?.name ?? ""}
                disabled
                placeholder="Student Name"
              />
            </div>
            <div>
              <Label htmlFor="studentRollNo">Roll Number</Label>
              <Input
                id="studentRollNo"
                value={student?.rollNo ?? rollNo}
                disabled
                placeholder="Roll Number"
              />
            </div>
          </div>

          <div className="mt-4">
            <ResultSubjectFields
              subjects={subjects}
              onSubjectNameChange={(subjectIndex, name) => {
                setEditedSubjects((currentSubjects) => {
                  const baseSubjects =
                    currentSubjects ?? initialSubjectsFromExistingResult;
                  const updatedSubjects = [...baseSubjects];
                  updatedSubjects[subjectIndex] = {
                    ...updatedSubjects[subjectIndex],
                    name,
                  };
                  return updatedSubjects;
                });
              }}
              onSubjectMarksChange={(subjectIndex, marks) => {
                setEditedSubjects((currentSubjects) => {
                  const baseSubjects =
                    currentSubjects ?? initialSubjectsFromExistingResult;
                  const updatedSubjects = [...baseSubjects];
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
            onClick={handleUpdateResultButtonClick}
          >
            {isLoading ? "Updating..." : "Update Result"}
          </Button>
        </div>
        </Card>
      </div>
    </main>
  );
}
