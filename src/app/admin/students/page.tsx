"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Sidebar } from "@/components/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
import { Table, TableCell, TableHead } from "@/components/ui/table";
import { isAdminSessionAuthenticatedInLocalStorage } from "@/lib/session";
import { useGetAllStudentsFromFirestoreQuery } from "@/store/api/portalApi";
import type { StudentDocument } from "@/types/student";

const SOFT_DELETED_STUDENT_ROLL_NUMBERS_STORAGE_KEY =
  "student_result_portal_soft_deleted_student_roll_numbers";

export default function AdminStudentListPage() {
  const router = useRouter();
  const { data: students = [], isLoading } =
    useGetAllStudentsFromFirestoreQuery();
  const [softDeletedStudentRollNumbers, setSoftDeletedStudentRollNumbers] =
    useState<string[]>(() => {
      if (typeof window === "undefined") {
        return [];
      }

      const storedSoftDeletedStudentRollNumbers = localStorage.getItem(
        SOFT_DELETED_STUDENT_ROLL_NUMBERS_STORAGE_KEY,
      );

      if (!storedSoftDeletedStudentRollNumbers) {
        return [];
      }

      try {
        return JSON.parse(storedSoftDeletedStudentRollNumbers) as string[];
      } catch {
        return [];
      }
    });

  useEffect(() => {
    if (!isAdminSessionAuthenticatedInLocalStorage()) {
      router.replace("/admin-login");
    }
  }, [router]);

  const visibleStudents = useMemo(() => {
    return students.filter((student) => {
      return !softDeletedStudentRollNumbers.includes(student.rollNo);
    });
  }, [students, softDeletedStudentRollNumbers]);

  function handleEditStudentActionClick(student: StudentDocument): void {
    router.push(
      `/admin-dashboard?editRollNo=${encodeURIComponent(student.rollNo)}`,
    );
  }

  function handleSoftDeleteStudentActionClick(studentRollNumber: string): void {
    setSoftDeletedStudentRollNumbers((currentSoftDeletedStudentRollNumbers) => {
      if (currentSoftDeletedStudentRollNumbers.includes(studentRollNumber)) {
        return currentSoftDeletedStudentRollNumbers;
      }

      const updatedSoftDeletedStudentRollNumbers = [
        ...currentSoftDeletedStudentRollNumbers,
        studentRollNumber,
      ];

      localStorage.setItem(
        SOFT_DELETED_STUDENT_ROLL_NUMBERS_STORAGE_KEY,
        JSON.stringify(updatedSoftDeletedStudentRollNumbers),
      );

      return updatedSoftDeletedStudentRollNumbers;
    });
  }

  return (
    <main className="w-full px-4 py-8 md:pl-80 md:pr-8">
      <Sidebar activePath="students" />

      <div className="mx-auto w-full max-w-5xl">
        <Card>
          <CardTitle>Student List</CardTitle>
          {isLoading ? (
            <p className="mt-4 text-sm text-[#675f74]">Loading students...</p>
          ) : null}

          <div className="mt-5 overflow-x-auto rounded-xl border border-[#e4deee]">
            <Table>
              <thead>
                <tr>
                  <TableHead>S.No</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Result Status</TableHead>
                  <TableHead>Action</TableHead>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((student, index) => (
                  <tr key={student.rollNo}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{student.rollNo}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>
                      {student.resultPosted
                        ? "Result Posted"
                        : "Result Pending"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="text-blue-600 transition hover:text-blue-700"
                          title="Update"
                          onClick={() => {
                            handleEditStudentActionClick(student);
                          }}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          type="button"
                          className="text-red-600 transition hover:text-red-700"
                          title="Delete (UI only)"
                          onClick={() => {
                            handleSoftDeleteStudentActionClick(student.rollNo);
                          }}
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </Table>

            {!isLoading && visibleStudents.length === 0 ? (
              <p className="px-4 py-6 text-sm text-[#675f74]">
                No students to show.
              </p>
            ) : null}
          </div>
        </Card>
      </div>
    </main>
  );
}
