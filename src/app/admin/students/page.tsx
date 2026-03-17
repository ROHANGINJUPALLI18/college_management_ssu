"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Card } from "@/components/ui/card";
import { Spinner, TableShimmerRows } from "@/components/ui/loading-state";
import { Table, TableCell, TableHead } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { StudentForm } from "@/components/admin/admin-dashboard-form";
import { isAdminSessionAuthenticatedInLocalStorage } from "@/lib/session";
import {
  useGetAllStudentsFromFirestoreQuery,
  useUpdateSingleStudentRecordMutation,
} from "@/store/api/portalApi";
import type { StudentDocument } from "@/types/student";

export default function AdminStudentListPage() {
  const router = useRouter();
  const { data: students = [], isLoading } =
    useGetAllStudentsFromFirestoreQuery();
  const [updateSingleStudentRecord, { isLoading: isUpdatingStudent }] =
    useUpdateSingleStudentRecordMutation();
  const [studentTableActionErrorMessage, setStudentTableActionErrorMessage] =
    useState("");
  const [
    studentRollNumberBeingSoftDeleted,
    setStudentRollNumberBeingSoftDeleted,
  ] = useState("");
  // modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEditRollNo, setModalEditRollNo] = useState<string | null>(null);
  useEffect(() => {
    if (!isAdminSessionAuthenticatedInLocalStorage()) {
      router.replace("/admin-login");
    }
  }, [router]);

  const visibleStudents = useMemo(() => {
    return students.filter((student) => {
      return student.isDelete !== true;
    });
  }, [students]);

  function handleEditStudentActionClick(student: StudentDocument): void {
    // open the form inside modal instead of navigating away
    setModalEditRollNo(student.rollNo);
    setIsModalOpen(true);
  }

  function handleStudentRowClickForResultFlow(student: StudentDocument): void {
    router.push(`/admin/update-result/${encodeURIComponent(student.rollNo)}`);
  }

  async function handleSoftDeleteStudentActionClick(
    studentRollNumber: string,
  ): Promise<void> {
    setStudentTableActionErrorMessage("");
    setStudentRollNumberBeingSoftDeleted(studentRollNumber);

    try {
      await updateSingleStudentRecord({
        rollNo: studentRollNumber,
        payload: {
          isDelete: true,
        },
      }).unwrap();
    } catch (error) {
      setStudentTableActionErrorMessage(
        (error as { error?: string })?.error ??
          "Unable to soft delete student right now.",
      );
    } finally {
      setStudentRollNumberBeingSoftDeleted("");
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] overflow-x-hidden">
      <Sidebar activePath="students" />

      <main className="flex-1 flex flex-col p-6 md:py-10 md:ml-[280px] md:pr-12">
        {/* Header with Breadcrumbs */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#2d1b6b]">
              Student List
            </h1>
            <p className="mt-2 text-[15px] font-medium text-slate-500">
              Manage and view all enrolled student records.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <span>Dashboard</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#2d1b6b]">Students</span>
          </div>
        </div>

        <div className="mx-auto w-full">
          <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
            {studentTableActionErrorMessage ? (
              <div className="mx-6 mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-600">
                {studentTableActionErrorMessage}
              </div>
            ) : null}

            <div className="overflow-x-auto">
              <Table>
                <thead className="border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <TableHead className="h-14 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      S.No
                    </TableHead>
                    <TableHead className="h-14 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Roll Number
                    </TableHead>
                    <TableHead className="h-14 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Name
                    </TableHead>
                    <TableHead className="h-14 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Photo
                    </TableHead>
                    <TableHead className="h-14 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      DOB
                    </TableHead>
                    <TableHead className="h-14 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Course
                    </TableHead>
                    <TableHead className="h-14 px-6 text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Result Status
                    </TableHead>
                    <TableHead className="h-14 px-6 text-right text-[11px] font-bold uppercase tracking-widest text-slate-500">
                      Action
                    </TableHead>
                  </tr>
                </thead>
                {isLoading ? (
                  <TableShimmerRows rowCount={6} />
                ) : (
                  <tbody className="divide-y divide-slate-50">
                    {visibleStudents.map((student, index) => (
                      <tr
                        key={student.rollNo}
                        className="group cursor-pointer transition-colors hover:bg-slate-50/80"
                        onClick={() => {
                          handleStudentRowClickForResultFlow(student);
                        }}
                      >
                        <TableCell className="px-6 py-4 text-sm font-medium text-slate-500">
                          {index + 1}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm font-bold text-slate-900">
                          {student.rollNo}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm font-semibold text-slate-700">
                          {student.name}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-slate-200">
                            <Image
                              src={student.photoUrl}
                              alt={`${student.name} profile photo`}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-slate-600">
                          {student.dob}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-sm text-slate-600">
                          {student.course}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${
                              student.resultPosted
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {student.resultPosted ? "Result Posted" : "Pending"}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                              title="Update"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEditStudentActionClick(student);
                              }}
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100 disabled:opacity-50"
                              title="Delete"
                              disabled={
                                isUpdatingStudent &&
                                studentRollNumberBeingSoftDeleted ===
                                  student.rollNo
                              }
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleSoftDeleteStudentActionClick(
                                  student.rollNo,
                                );
                              }}
                            >
                              {isUpdatingStudent &&
                              studentRollNumberBeingSoftDeleted ===
                                student.rollNo ? (
                                <Spinner className="h-3.5 w-3.5" />
                              ) : (
                                <FiTrash2 size={14} />
                              )}
                            </button>
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                )}
              </Table>

              {/* Empty State */}
              {!isLoading && visibleStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-200">
                    <Inbox size={40} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-400">
                    No students to show.
                  </h3>
                  <p className="mt-2 text-sm font-medium text-slate-400">
                    Get started by adding a new student to the database.
                  </p>
                </div>
              ) : null}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between border-t border-slate-50 bg-white px-6 py-4">
              <span className="text-[13px] font-medium text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-900">
                  {visibleStudents.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {visibleStudents.length}
                </span>{" "}
                entries
              </span>
              <div className="flex gap-2">
                <button
                  disabled
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  disabled
                  className="flex items-center gap-1 rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-bold text-slate-600 transition hover:bg-slate-50 disabled:bg-slate-50 disabled:text-slate-300"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Floating Add Button */}
        <button
          className="fixed bottom-10 right-10 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#3471f5] text-white shadow-[0_8px_30px_rgb(52,113,245,0.4)] transition-all hover:scale-110 hover:bg-[#2d63dd] active:scale-95"
          title="Add student"
          onClick={() => {
            setModalEditRollNo(null);
            setIsModalOpen(true);
          }}
        >
          <FiPlus size={28} />
        </button>

        {/* Modal containing the student form */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setModalEditRollNo(null);
          }}
        >
          <div className="bg-[#2d1b6b] px-6 py-6 text-center text-white">
            <h1 className="text-xl font-bold tracking-tight">
              {modalEditRollNo ? "Update Details" : "New Student"}
            </h1>
            <p className="mt-1 text-xs font-medium text-indigo-200">
              Fill the information below
            </p>
          </div>
          <div className="bg-white px-6 pb-8 pt-4">
            <StudentForm
              editRollNo={modalEditRollNo ?? undefined}
              onSuccess={() => setIsModalOpen(false)}
            />
          </div>
        </Modal>
      </main>
    </div>
  );
}
