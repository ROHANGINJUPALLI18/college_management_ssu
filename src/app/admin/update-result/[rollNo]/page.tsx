"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { PencilLine, PlusCircle, RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ResultSubjectFields } from "@/components/result-subject-fields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShimmerBlock,
  Spinner,
  TableShimmerRows,
} from "@/components/ui/loading-state";
import { Table, TableCell, TableHead } from "@/components/ui/table";
import { isAdminSessionAuthenticatedInLocalStorage } from "@/lib/session";
import {
  useGetSingleStudentByRollNumberQuery,
  useGetStudentResultByResultIdQuery,
  useGetStudentResultsByRollNumberQuery,
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
  const searchParams = useSearchParams();
  const params = useParams<{ rollNo: string }>();
  const rollNo = params.rollNo;
  const resultId = searchParams.get("resultId") ?? "";
  const isEditMode = Boolean(resultId);
  const [errorMessage, setErrorMessage] = useState("");
  const [editedSubjects, setEditedSubjects] = useState<
    { name: string; marks: number }[] | null
  >(null);
  const [editedHeading, setEditedHeading] = useState<string | null>(null);

  const { data: student, isLoading: isStudentLoading } =
    useGetSingleStudentByRollNumberQuery(rollNo);
  const { data: studentResults = [], isLoading: isResultListLoading } =
    useGetStudentResultsByRollNumberQuery(rollNo);
  const { data: selectedResult, isLoading: isSelectedResultLoading } =
    useGetStudentResultByResultIdQuery(resultId, { skip: !isEditMode });
  const [updateResult, { isLoading }] =
    useUpdateStudentResultByRollNumberMutation();
  const isPageLoading =
    isStudentLoading ||
    (isEditMode ? isSelectedResultLoading : isResultListLoading);

  useEffect(() => {
    if (!isAdminSessionAuthenticatedInLocalStorage()) {
      router.replace("/admin-login");
    }
  }, [router]);

  useEffect(() => {
    setEditedHeading(null);
    setEditedSubjects(null);
    setErrorMessage("");
  }, [resultId]);

  const initialSubjectsFromExistingResult = useMemo(() => {
    if (!selectedResult?.subjects?.length) {
      return defaultSubjects;
    }

    const mappedSubjects = selectedResult.subjects.slice(0, 5);
    while (mappedSubjects.length < 5) {
      mappedSubjects.push({ name: "", marks: 0 });
    }
    return mappedSubjects;
  }, [selectedResult]);

  const subjects = editedSubjects ?? initialSubjectsFromExistingResult;
  const heading = editedHeading ?? selectedResult?.heading ?? "Semester 1";

  const hasAnySubjects = useMemo(
    () => subjects.some((subject) => subject.name.trim().length > 0),
    [subjects],
  );

  async function handleUpdateResultButtonClick(): Promise<void> {
    if (!resultId) {
      setErrorMessage("Result id is missing. Please reopen this result.");
      return;
    }

    const hasIncompleteField = subjects.some(
      (subject) => !subject.name.trim() || Number.isNaN(subject.marks),
    );

    if (!heading.trim() || hasIncompleteField) {
      setErrorMessage("Result heading and all subject fields are required.");
      return;
    }

    try {
      await updateResult({ resultId, heading, subjects }).unwrap();
      router.push(`/admin/update-result/${encodeURIComponent(rollNo)}`);
    } catch (error) {
      setErrorMessage(
        (error as { error?: string })?.error ?? "Unable to update result.",
      );
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-x-hidden">
      <Sidebar activePath="students" />

      <main className="flex-1 flex flex-col items-center p-6 md:ml-[280px] md:pr-12 md:py-12">
        <div className="w-full max-w-[800px]">
          <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] ring-1 ring-slate-100">
            <div className="bg-[#2d1b6b] px-8 py-8 text-center text-white">
              <h1 className="text-2xl font-bold tracking-tight">
                {isEditMode ? "Update Student Result" : "Student Results"}
              </h1>
              <p className="mt-2 text-sm font-medium text-indigo-200">
                Roll Number:{" "}
                <span className="text-white bg-indigo-500/30 px-2 py-0.5 rounded-md">
                  {rollNo}
                </span>
              </p>
            </div>

            {!isEditMode ? (
              <div className="px-8 pb-10 pt-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Published Results
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      View and edit existing results or create a new one.
                    </p>
                  </div>
                  <Button
                    className="h-10 rounded-lg bg-[#2d1b6b] px-4 text-sm font-bold text-white hover:bg-[#3d278b]"
                    onClick={() => {
                      router.push(
                        `/admin/add-result/${encodeURIComponent(rollNo)}`,
                      );
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Result
                  </Button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <Table>
                    <thead className="border-b border-slate-100 bg-slate-50/50">
                      <tr>
                        <TableHead className="h-12 px-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          S.No
                        </TableHead>
                        <TableHead className="h-12 px-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Heading
                        </TableHead>
                        <TableHead className="h-12 px-5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Subjects
                        </TableHead>
                        <TableHead className="h-12 px-5 text-right text-[11px] font-bold uppercase tracking-widest text-slate-500">
                          Action
                        </TableHead>
                      </tr>
                    </thead>
                    {isPageLoading ? (
                      <TableShimmerRows rowCount={4} />
                    ) : (
                      <tbody className="divide-y divide-slate-50">
                        {studentResults.map((result, index) => (
                          <tr key={result.id} className="hover:bg-slate-50/70">
                            <TableCell className="px-5 py-4 text-sm font-medium text-slate-500">
                              {index + 1}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-sm font-semibold text-slate-700">
                              {result.heading}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-sm text-slate-600">
                              {result.subjects.length}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-right">
                              <Button
                                className="h-9 rounded-lg bg-blue-50 px-3 text-xs font-bold text-blue-600 hover:bg-blue-100"
                                onClick={() => {
                                  router.push(
                                    `/admin/update-result/${encodeURIComponent(rollNo)}?resultId=${encodeURIComponent(result.id)}`,
                                  );
                                }}
                              >
                                <PencilLine className="mr-1.5 h-3.5 w-3.5" />
                                Edit
                              </Button>
                            </TableCell>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </Table>
                </div>

                {!isPageLoading && studentResults.length === 0 ? (
                  <p className="mt-6 rounded-lg bg-slate-50 px-4 py-4 text-center text-sm font-medium text-slate-500">
                    No results added yet for this student. Use Create Result to
                    add one.
                  </p>
                ) : null}
              </div>
            ) : !isPageLoading && !selectedResult ? (
              <div className="px-8 pb-10 pt-8">
                <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
                  Selected result was not found. Please choose a result from the
                  list.
                </p>
                <div className="mt-6">
                  <Button
                    className="h-10 rounded-lg bg-[#2d1b6b] px-4 text-sm font-bold text-white hover:bg-[#3d278b]"
                    onClick={() => {
                      router.push(
                        `/admin/update-result/${encodeURIComponent(rollNo)}`,
                      );
                    }}
                  >
                    Back to Results List
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-8 pb-10 pt-8">
                <div className="mb-6 grid grid-cols-1 gap-6 border-b border-slate-100 pb-8 md:grid-cols-2">
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <Label className="text-sm font-bold text-slate-700">
                      Student Profile
                    </Label>
                    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-slate-200">
                        {student?.photoUrl ? (
                          <Image
                            src={student.photoUrl}
                            alt={`${student.name ?? "Student"} profile photo`}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-slate-200 text-xs font-bold uppercase text-slate-500">
                            NA
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        {student?.name ?? "Student"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="studentName"
                      className="text-sm font-bold text-slate-700"
                    >
                      Student Name
                    </Label>
                    <Input
                      id="studentName"
                      value={student?.name ?? ""}
                      disabled
                      className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-600 disabled:opacity-100"
                      placeholder="Student Name"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="studentRollNo"
                      className="text-sm font-bold text-slate-700"
                    >
                      Roll Number
                    </Label>
                    <Input
                      id="studentRollNo"
                      value={student?.rollNo ?? rollNo}
                      disabled
                      className="h-11 rounded-xl border-slate-200 bg-slate-50 text-slate-600 disabled:opacity-100"
                      placeholder="Roll Number"
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <Label
                      htmlFor="resultHeading"
                      className="text-sm font-bold text-slate-700"
                    >
                      Result Heading
                    </Label>
                    <Input
                      id="resultHeading"
                      value={heading}
                      disabled={isLoading || isPageLoading}
                      onChange={(e) => setEditedHeading(e.target.value)}
                      className="h-11 rounded-xl border-slate-200 bg-white text-slate-700 focus:ring-[#2d1b6b]"
                      placeholder="e.g. Semester 1, Final Exam 2025"
                    />
                  </div>
                </div>

                {isPageLoading ? (
                  <div className="mb-6 space-y-3">
                    <ShimmerBlock className="h-4 w-44" />
                    <ShimmerBlock className="h-24 w-full rounded-2xl" />
                    <ShimmerBlock className="h-24 w-full rounded-2xl" />
                  </div>
                ) : !hasAnySubjects ? (
                  <p className="mb-6 text-center text-sm font-medium text-slate-500 animate-pulse">
                    Loading existing results...
                  </p>
                ) : null}

                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-800">
                    Edit Subject Marks
                  </h2>
                </div>

                <ResultSubjectFields
                  subjects={subjects}
                  disabled={isLoading || isPageLoading}
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

                {errorMessage ? (
                  <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {errorMessage}
                  </p>
                ) : null}

                <div className="mt-8 flex justify-center">
                  <Button
                    className="h-12 w-full max-w-[240px] rounded-xl bg-[#2d1b6b] text-base font-bold text-white shadow-md hover:bg-[#3d278b] hover:shadow-lg disabled:opacity-70"
                    disabled={isLoading || isPageLoading}
                    onClick={handleUpdateResultButtonClick}
                  >
                    {isLoading ? (
                      <Spinner className="mr-2 h-5 w-5" />
                    ) : (
                      <RefreshCw className="mr-2 h-5 w-5" />
                    )}
                    {isLoading ? "Updating..." : "Update Result"}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
