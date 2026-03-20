"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import { ChevronRight, Download, FileText, Loader } from "lucide-react";
import { StudentIDCard } from "@/components/student-id-card";
import { Button } from "@/components/ui/button";
import { getStudentSessionFromLocalStorage } from "@/lib/session";
import {
  generateStudentCardPDF,
  generateStudentCardWithResultsPDF,
} from "@/lib/pdfGenerator";
import { useGetStudentResultsByRollNumberQuery } from "@/store/api/portalApi";
import type { StudentDocument } from "@/types/student";
import type { ResultDocument } from "@/types/result";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [studentSession, setStudentSession] = useState<StudentDocument | null>(
    null,
  );
  const [isGeneratingCardPDF, setIsGeneratingCardPDF] = useState(false);
  const [isGeneratingResultPDF, setIsGeneratingResultPDF] = useState(false);
  const studentCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const session = getStudentSessionFromLocalStorage();
    if (!session) {
      router.replace("/student-login");
    } else {
      setStudentSession(session);
      setMounted(true);
    }
  }, [router]);

  const { data: results = [], isLoading: isResultLoading } =
    useGetStudentResultsByRollNumberQuery(studentSession?.rollNo ?? "", {
      skip: !studentSession,
    });

  if (!mounted || !studentSession) return null;

  // Build semester list from all available results
  const semesters = results.map((result) => ({
    id: (result.heading || "Semester 1").toLowerCase().replace(/\s+/g, "-"),
    label: result.heading || "Semester 1",
    published: true,
    result: result,
  }));

  async function handleDownloadStudentCardPDF(): Promise<void> {
    if (!studentSession) {
      return;
    }

    setIsGeneratingCardPDF(true);
    try {
      // Ensure element is fully rendered before capturing
      await new Promise((resolve) => setTimeout(resolve, 100));
      await generateStudentCardPDF(studentSession, studentCardRef.current);
    } catch (error) {
      console.error("Error downloading student card:", error);
    } finally {
      setIsGeneratingCardPDF(false);
    }
  }

  async function handleDownloadResultPDF(): Promise<void> {
    if (!studentSession || results.length === 0) {
      return;
    }

    setIsGeneratingResultPDF(true);
    try {
      // Ensure element is fully rendered before capturing
      await new Promise((resolve) => setTimeout(resolve, 100));
      await generateStudentCardWithResultsPDF(
        studentSession,
        results[0],
        studentCardRef.current,
      );
    } catch (error) {
      console.error("Error downloading result:", error);
    } finally {
      setIsGeneratingResultPDF(false);
    }
  }

  async function handleDownloadIndividualResultPDF(
    result: ResultDocument,
  ): Promise<void> {
    if (!studentSession) {
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await generateStudentCardWithResultsPDF(
        studentSession,
        result,
        studentCardRef.current,
      );
    } catch (error) {
      console.error("Error downloading result:", error);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="border-b border-[#f6b100]/30 pb-6">
        <p className="text-xs font-bold text-[#f6b100] uppercase tracking-[0.2em] mb-1">
          Student Portal
        </p>
        <h1 className="text-3xl font-extrabold text-[#2f0a5e] tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back,{" "}
          <span className="font-semibold text-[#2f0a5e]">
            {studentSession.name}
          </span>
        </p>
      </div>

      {/* Student Info Card */}
      <div className="space-y-3">
        <div className="flex justify-end">
          <Button
            onClick={handleDownloadStudentCardPDF}
            disabled={isGeneratingCardPDF}
            className="h-9 rounded-lg bg-[#2f0a5e] px-4 text-xs font-bold text-white hover:bg-[#25084a] disabled:opacity-60"
          >
            {isGeneratingCardPDF ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Student Card PDF
              </>
            )}
          </Button>
        </div>
        <div ref={studentCardRef}>
          <StudentIDCard student={studentSession} />
        </div>
      </div>

      {/* Semester Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#2f0a5e] flex items-center gap-2">
            <span className="inline-block h-4 w-1.5 rounded-full bg-[#f6b100]" />
            Semester Results
          </h2>
          <Button
            onClick={handleDownloadResultPDF}
            disabled={results.length === 0 || isGeneratingResultPDF}
            className="h-9 rounded-lg bg-[#2f0a5e] px-4 text-xs font-bold text-white hover:bg-[#25084a] disabled:opacity-60"
          >
            {isGeneratingResultPDF ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Latest Result PDF
              </>
            )}
          </Button>
        </div>

        <div className="rounded-xl border border-[#e8e0f5] bg-white shadow-sm overflow-hidden divide-y divide-[#f0eaf8] transition-all duration-300 hover:ring-2 hover:ring-[#2f0a5e] hover:border-[#2f0a5e]/50 hover:shadow-lg">
          {isResultLoading ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <div className="h-5 w-5 rounded-full border-4 border-[#f6b100]/30 border-t-[#f6b100] animate-spin" />
              <span className="text-sm text-gray-400 font-medium">
                Loading results…
              </span>
            </div>
          ) : (
            semesters.map((sem) =>
              sem.published ? (
                <div
                  key={sem.id}
                  className="group flex items-center justify-between px-6 py-4 transition-all duration-200 hover:bg-[#2f0a5e]/5"
                >
                  <Link
                    href={`/student/result/${sem.id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6b100]/10 group-hover:bg-[#f6b100]/20 transition-colors shrink-0">
                      <FileText className="h-5 w-5 text-[#f6b100]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2f0a5e] transition-colors text-sm">
                        {sem.label}
                      </p>
                      <p className="text-xs text-gray-400 transition-colors">
                        Click to view result
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDownloadIndividualResultPDF(sem.result);
                      }}
                      className="flex h-9 items-center gap-2 rounded-lg bg-[#f6b100]/10 px-3 text-xs font-bold text-[#f6b100] hover:bg-[#f6b100]/20 transition-colors"
                      title="Download Result PDF"
                    >
                      <Download className="h-4 w-4" />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#f6b100] transition-colors" />
                  </div>
                </div>
              ) : (
                <div
                  key={sem.id}
                  className="flex items-center justify-between px-6 py-4 opacity-50 cursor-not-allowed select-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 shrink-0">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-500 text-sm">
                        {sem.label}
                      </p>
                      <p className="text-xs text-gray-400">
                        Result not published yet
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-bold text-gray-400">
                    Pending
                  </span>
                </div>
              ),
            )
          )}
        </div>
      </div>
    </div>
  );
}
