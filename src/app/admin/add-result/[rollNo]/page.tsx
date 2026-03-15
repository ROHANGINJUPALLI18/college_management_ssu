"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ResultSubjectFields } from "@/components/result-subject-fields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [heading, setHeading] = useState("Semester 1");
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
    if (!heading.trim() || hasIncompleteField) {
      setErrorMessage("Result heading and all subject fields are required.");
      return;
    }

    try {
      await createResult({ rollNo, heading, subjects }).unwrap();
      router.push("/admin/students");
    } catch (error) {
      setErrorMessage(
        (error as { error?: string })?.error ?? "Unable to post result.",
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
              <h1 className="text-2xl font-bold tracking-tight">Post Student Result</h1>
              <p className="mt-2 text-sm font-medium text-indigo-200">
                Roll Number: <span className="text-white bg-indigo-500/30 px-2 py-0.5 rounded-md">{rollNo}</span>
              </p>
            </div>
            
            <div className="px-8 pb-10 pt-8">
              <div className="mb-8 grid grid-cols-1 gap-6 border-b border-slate-100 pb-8">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="resultHeading" className="text-sm font-bold text-slate-700">Result Heading</Label>
                  <Input
                    id="resultHeading"
                    value={heading}
                    onChange={(e) => setHeading(e.target.value)}
                    className="h-11 rounded-xl border-slate-200 bg-white text-slate-700 focus:ring-[#2d1b6b]"
                    placeholder="e.g. Semester 1, Final Exam 2025"
                  />
                </div>
              </div>

              <div className="mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-800">Subject Marks</h2>
              </div>
              
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

              {errorMessage ? (
                <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {errorMessage}
                </p>
              ) : null}
              
              <div className="mt-8 flex justify-center">
                <Button
                  className="h-12 w-full max-w-[240px] rounded-xl bg-[#2d1b6b] text-base font-bold text-white shadow-md hover:bg-[#3d278b] hover:shadow-lg disabled:opacity-70"
                  disabled={isLoading}
                  onClick={handlePostResultButtonClick}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  {isLoading ? "Posting..." : "Post Result"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
