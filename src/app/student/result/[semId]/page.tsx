"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Download,
  User,
  Hash,
  BookOpen,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStudentSessionFromLocalStorage } from "@/lib/session";
import { useGetStudentResultByRollNumberQuery } from "@/store/api/portalApi";
import type { StudentDocument } from "@/types/student";

function getGrade(marks: number): { grade: string; color: string } {
  if (marks >= 90) return { grade: "A+", color: "text-emerald-600 bg-emerald-50" };
  if (marks >= 80) return { grade: "A", color: "text-green-600 bg-green-50" };
  if (marks >= 70) return { grade: "B+", color: "text-teal-600 bg-teal-50" };
  if (marks >= 60) return { grade: "B", color: "text-blue-600 bg-blue-50" };
  if (marks >= 50) return { grade: "C", color: "text-yellow-600 bg-yellow-50" };
  if (marks >= 40) return { grade: "D", color: "text-orange-600 bg-orange-50" };
  return { grade: "F", color: "text-red-600 bg-red-50" };
}

const SEM_LABEL_MAP: Record<string, string> = {
  sem1: "Semester 1",
  sem2: "Semester 2",
  sem3: "Semester 3",
  sem4: "Semester 4",
  sem5: "Semester 5",
  sem6: "Semester 6",
};

export default function StudentResultPage() {
  const router = useRouter();
  const params = useParams<{ semId: string }>();
  const semId = params.semId;
  const semLabel = SEM_LABEL_MAP[semId] ?? "Semester";

  const [mounted, setMounted] = useState(false);
  const [studentSession, setStudentSession] = useState<StudentDocument | null>(null);

  useEffect(() => {
    const session = getStudentSessionFromLocalStorage();
    if (!session) {
      router.replace("/student-login");
    } else {
      setStudentSession(session);
      setMounted(true);
    }
  }, [router]);

  const { data: result, isLoading } = useGetStudentResultByRollNumberQuery(
    studentSession?.rollNo ?? "",
    { skip: !studentSession }
  );

  if (!mounted || !studentSession) return null;

  const totalMarks = result?.subjects.reduce((sum, s) => sum + s.marks, 0) ?? 0;
  const average = result?.subjects.length
    ? (totalMarks / result.subjects.length).toFixed(1)
    : "0.0";
  const isPassed = result?.subjects.every((s) => s.marks >= 40) ?? false;

  function handleDownloadPDF() {
    if (!result || !studentSession) return;
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.setTextColor(75, 46, 131);
    pdf.text("Sikkim Skill University", 14, 20);

    pdf.setFontSize(13);
    pdf.setTextColor(50, 50, 50);
    pdf.text(`Result Statement – ${result.heading || semLabel}`, 14, 30);

    pdf.setFontSize(11);
    pdf.text(`Name   : ${studentSession.name}`, 14, 44);
    pdf.text(`Roll No: ${studentSession.rollNo}`, 14, 52);
    pdf.text(`Course : ${studentSession.course}`, 14, 60);

    pdf.setDrawColor(200, 200, 200);
    pdf.line(14, 66, 196, 66);

    // Table header
    pdf.setFontSize(11);
    pdf.setTextColor(75, 46, 131);
    pdf.text("Subject", 14, 74);
    pdf.text("Marks", 130, 74);
    pdf.text("Grade", 165, 74);

    pdf.setTextColor(50, 50, 50);
    let y = 84;
    result.subjects.forEach((s) => {
      pdf.text(s.name, 14, y);
      pdf.text(String(s.marks), 130, y);
      pdf.text(getGrade(s.marks).grade, 165, y);
      y += 10;
    });

    pdf.line(14, y + 2, 196, y + 2);
    y += 12;
    pdf.setFontSize(11);
    pdf.text(`Total Marks : ${totalMarks}`, 14, y);
    pdf.text(`Average     : ${average}`, 14, y + 8);
    pdf.setTextColor(isPassed ? 22 : 220, isPassed ? 163 : 38, isPassed ? 74 : 38);
    pdf.setFontSize(13);
    pdf.text(`Result: ${isPassed ? "PASS" : "FAIL"}`, 14, y + 20);

    pdf.save(`${studentSession.rollNo}-${semId}-result.pdf`);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/student-dashboard#results"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-gray-500 hover:text-[#4B2E83] hover:border-[#4B2E83] transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-[#1E1E2D] tracking-tight">
            {result?.heading ?? semLabel} – Result Sheet
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Academic Year 2025-26</p>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="border-none shadow-md bg-white !p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-[#4B2E83] to-[#6C63FF] px-6 py-4">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-200 mb-1">
            Student Information
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100 p-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <User className="h-4 w-4 text-[#4B2E83]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Name</p>
              <p className="font-bold text-[#1E1E2D]">{studentSession.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:pl-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Hash className="h-4 w-4 text-[#4B2E83]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Roll No</p>
              <p className="font-bold text-[#1E1E2D]">{studentSession.rollNo}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:pl-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <BookOpen className="h-4 w-4 text-[#4B2E83]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Course</p>
              <p className="font-bold text-[#1E1E2D]">{studentSession.course}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Result Table */}
      {isLoading ? (
        <Card className="border-none shadow-md bg-white text-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-4 border-purple-200 border-t-[#4B2E83] animate-spin" />
            <p className="text-gray-400 font-medium">Loading your result...</p>
          </div>
        </Card>
      ) : !result ? (
        <Card className="border-none shadow-md bg-white text-center py-12">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-yellow-500" />
            </div>
            <p className="text-gray-500 font-medium">Result not published yet.</p>
            <p className="text-sm text-gray-400">Please check back later or contact administration.</p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="border-none shadow-md bg-white !p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">#</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400">Subject</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Marks</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {result.subjects.map((subject, i) => {
                    const { grade, color } = getGrade(subject.marks);
                    return (
                      <tr key={subject.name} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-400 font-medium">{i + 1}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-700">{subject.name}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-lg font-bold text-[#1E1E2D]">{subject.marks}</span>
                          <span className="text-xs text-gray-400 ml-1">/100</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-bold ${color}`}>
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 border-t border-gray-200">
                    <td colSpan={2} className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wide">
                      Summary
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs text-gray-400 font-semibold">Total</p>
                      <p className="text-lg font-extrabold text-[#4B2E83]">{totalMarks}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-xs text-gray-400 font-semibold">Average</p>
                      <p className="text-lg font-extrabold text-[#4B2E83]">{average}%</p>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Result Banner */}
          <div className={`flex items-center justify-between rounded-xl p-5 ${isPassed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
            <div className="flex items-center gap-4">
              {isPassed ? (
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              ) : (
                <XCircle className="h-8 w-8 text-red-500" />
              )}
              <div>
                <p className={`text-xl font-extrabold tracking-wide ${isPassed ? "text-green-700" : "text-red-700"}`}>
                  {isPassed ? "PASS" : "FAIL"}
                </p>
                <p className={`text-sm font-medium ${isPassed ? "text-green-600" : "text-red-600"}`}>
                  {isPassed
                    ? "Congratulations! You have passed all subjects."
                    : "You have not cleared all subjects. Please contact the college."}
                </p>
              </div>
            </div>
            <Button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-[#4B2E83] hover:bg-[#382261] text-white font-bold px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
