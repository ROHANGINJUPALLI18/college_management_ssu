"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ResultTable } from "@/components/result-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShimmerBlock, Spinner } from "@/components/ui/loading-state";
import { getStudentSessionFromLocalStorage } from "@/lib/session";
import { useGetStudentResultByRollNumberQuery } from "@/store/api/portalApi";

export default function ResultDetailsPage() {
  const router = useRouter();
  const params = useParams<{ rollNo: string }>();
  const rollNo = params.rollNo;

  const { data: result, isLoading } =
    useGetStudentResultByRollNumberQuery(rollNo);

  useEffect(() => {
    const studentSession = getStudentSessionFromLocalStorage();
    if (!studentSession) {
      router.replace("/student-login");
      return;
    }
    if (studentSession.rollNo !== rollNo) {
      router.replace(`/result/${studentSession.rollNo}`);
    }
  }, [rollNo, router]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <h1 className="text-3xl text-[#2f0a5e]">Result Details</h1>

      {isLoading ? (
        <Card className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <Spinner className="text-[#2f0a5e]" />
            <p className="text-sm text-[#675d77]">Loading result...</p>
          </div>
          <ShimmerBlock className="h-10 w-48" />
          <ShimmerBlock className="h-40 w-full" />
        </Card>
      ) : null}

      {!isLoading && !result ? (
        <Card className="mt-6">
          <p className="text-sm text-[#584d69]">
            Result not posted yet. Please contact administration.
          </p>
        </Card>
      ) : null}

      {result ? (
        <div className="mt-6">
          <ResultTable result={result} />
        </div>
      ) : null}

      <Link href="/student-dashboard">
        <Button className="mt-4" variant="outline">
          Back to Dashboard
        </Button>
      </Link>
    </main>
  );
}
