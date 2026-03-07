"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { StudentIDCard } from "@/components/student-id-card";
import {
  clearStudentSessionFromLocalStorage,
  getStudentSessionFromLocalStorage,
} from "@/lib/session";
import type { StudentDocument } from "@/types/student";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [studentSession] = useState<StudentDocument | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return getStudentSessionFromLocalStorage();
  });

  useEffect(() => {
    if (!studentSession) {
      router.replace("/student-login");
    }
  }, [router, studentSession]);

  if (!studentSession) {
    return null;
  }

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-3xl text-[#2f0a5e]">Student Dashboard</h1>
      <p className="mt-2 text-sm text-[#5f5370]">
        Welcome back, {studentSession.name}
      </p>

      <div className="mt-6">
        <StudentIDCard student={studentSession} />
      </div>

      <Card className="mt-6">
        <CardTitle>Semester Results</CardTitle>
        <CardDescription className="mt-2">
          View your published result and download a PDF copy for your records.
        </CardDescription>
        <Link href={`/result/${studentSession.rollNo}`}>
          <Button className="mt-4">View Result</Button>
        </Link>
      </Card>

      <Button
        className="mt-4"
        variant="outline"
        onClick={() => {
          clearStudentSessionFromLocalStorage();
          router.push("/student-login");
        }}
      >
        Logout
      </Button>
    </main>
  );
}
