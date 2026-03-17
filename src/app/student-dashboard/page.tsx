"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import { ChevronRight, Download, FileText } from "lucide-react";
import { StudentIDCard } from "@/components/student-id-card";
import { Button } from "@/components/ui/button";
import { getStudentSessionFromLocalStorage } from "@/lib/session";
import { useGetStudentResultByRollNumberQuery } from "@/store/api/portalApi";
import type { StudentDocument } from "@/types/student";

function getGrade(marks: number): string {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  if (marks >= 50) return "C";
  if (marks >= 40) return "D";
  return "F";
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [studentSession, setStudentSession] = useState<StudentDocument | null>(
    null,
  );

  useEffect(() => {
    const session = getStudentSessionFromLocalStorage();
    if (!session) {
      router.replace("/student-login");
    } else {
      setStudentSession(session);
      setMounted(true);
    }
  }, [router]);

  const { data: result, isLoading: isResultLoading } =
    useGetStudentResultByRollNumberQuery(studentSession?.rollNo ?? "", {
      skip: !studentSession,
    });

  if (!mounted || !studentSession) return null;

  // Build semester list — show sem1 if result is published
  const semesters = result
    ? [
        {
          id: (result.heading || "Semester 1")
            .toLowerCase()
            .replace(/\s+/g, "-"),
          label: result.heading || "Semester 1",
          published: true,
        },
      ]
    : [{ id: "sem1", label: "Semester 1", published: false }];

  function handleDownloadStudentCardPDF(): void {
    if (!studentSession) {
      return;
    }

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.setTextColor(47, 10, 94);
    pdf.text("Sikkim Skill University", 14, 20);

    pdf.setFontSize(13);
    pdf.setTextColor(70, 70, 70);
    pdf.text("Student Identity Card", 14, 30);

    pdf.setFontSize(11);
    pdf.text(`Name      : ${studentSession.name}`, 14, 46);
    pdf.text(`Roll No   : ${studentSession.rollNo}`, 14, 54);
    pdf.text(`Course    : ${studentSession.course}`, 14, 62);
    pdf.text(`DOB       : ${studentSession.dob}`, 14, 70);

    pdf.setFontSize(10);
    pdf.setTextColor(120, 120, 120);
    pdf.text("Generated from Student Portal", 14, 84);

    pdf.save(`${studentSession.rollNo}-student-card.pdf`);
  }

  function handleDownloadResultPDF(): void {
    if (!studentSession || !result) {
      return;
    }

    const totalMarks = result.subjects.reduce(
      (total, subject) => total + subject.marks,
      0,
    );
    const average = result.subjects.length
      ? (totalMarks / result.subjects.length).toFixed(1)
      : "0.0";
    const isPassed = result.subjects.every((subject) => subject.marks >= 40);

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.setTextColor(75, 46, 131);
    pdf.text("Sikkim Skill University", 14, 20);

    pdf.setFontSize(13);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Result Statement – ${result.heading || "Semester 1"}`, 14, 30);

    pdf.setFontSize(11);
    pdf.text(`Name   : ${studentSession.name}`, 14, 44);
    pdf.text(`Roll No: ${studentSession.rollNo}`, 14, 52);
    pdf.text(`Course : ${studentSession.course}`, 14, 60);

    pdf.setDrawColor(200, 200, 200);
    pdf.line(14, 66, 196, 66);

    pdf.setFontSize(11);
    pdf.setTextColor(75, 46, 131);
    pdf.text("Subject", 14, 74);
    pdf.text("Marks", 130, 74);
    pdf.text("Grade", 165, 74);

    pdf.setTextColor(50, 50, 50);
    let y = 84;
    result.subjects.forEach((subject) => {
      pdf.text(subject.name, 14, y);
      pdf.text(String(subject.marks), 130, y);
      pdf.text(getGrade(subject.marks), 165, y);
      y += 10;
    });

    pdf.line(14, y + 2, 196, y + 2);
    y += 12;
    pdf.setFontSize(11);
    pdf.text(`Total Marks : ${totalMarks}`, 14, y);
    pdf.text(`Average     : ${average}`, 14, y + 8);
    pdf.setTextColor(
      isPassed ? 22 : 220,
      isPassed ? 163 : 38,
      isPassed ? 74 : 38,
    );
    pdf.setFontSize(13);
    pdf.text(`Result: ${isPassed ? "PASS" : "FAIL"}`, 14, y + 20);

    pdf.save(`${studentSession.rollNo}-${result.heading || "result"}.pdf`);
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
            className="h-9 rounded-lg bg-[#2f0a5e] px-4 text-xs font-bold text-white hover:bg-[#25084a]"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Student Card PDF
          </Button>
        </div>
        <StudentIDCard student={studentSession} />
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
            disabled={!result}
            className="h-9 rounded-lg bg-[#2f0a5e] px-4 text-xs font-bold text-white hover:bg-[#25084a] disabled:opacity-60"
          >
            <Download className="mr-2 h-4 w-4" />
            Download Result PDF
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
                <Link
                  key={sem.id}
                  href={`/student/result/${sem.id}`}
                  className="group flex items-center justify-between px-6 py-4 transition-all duration-200 hover:bg-[#2f0a5e]/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f6b100]/10 group-hover:bg-[#f6b100]/20 transition-colors shrink-0">
                      <FileText className="h-5 w-5 text-[#f6b100]" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2f0a5e] transition-colors text-sm">
                        {sem.label}
                      </p>
                      <p className="text-xs text-gray-400 transition-colors">
                        Result Published · Click to view
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex rounded-full bg-[#f6b100]/15 px-3 py-0.5 text-xs font-bold text-[#b07a00] group-hover:bg-[#f6b100]/30 transition-colors">
                      Published
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-[#f6b100] transition-colors" />
                  </div>
                </Link>
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
