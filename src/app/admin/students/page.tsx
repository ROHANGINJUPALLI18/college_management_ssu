"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { Sidebar } from "@/components/sidebar";
import { Card, CardTitle } from "@/components/ui/card";
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
    if (student.resultPosted) {
      router.push(`/admin/update-result/${encodeURIComponent(student.rollNo)}`);
      return;
    }

    router.push(`/admin/add-result/${encodeURIComponent(student.rollNo)}`);
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
    <main className="w-full px-4 py-8 md:pl-80 md:pr-8">
      <Sidebar activePath="students" />

      <div className="mx-auto w-full max-w-5xl">
        <Card>
          <CardTitle>Student List</CardTitle>
          {isLoading ? (
            <p className="mt-4 text-sm text-[#675f74]">Loading students...</p>
          ) : null}
          {studentTableActionErrorMessage ? (
            <p className="mt-4 text-sm text-red-600">
              {studentTableActionErrorMessage}
            </p>
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
                  <tr
                    key={student.rollNo}
                    className="cursor-pointer transition hover:bg-[#faf7ff]"
                    onClick={() => {
                      handleStudentRowClickForResultFlow(student);
                    }}
                  >
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
                          onClick={(event) => {
                            event.stopPropagation();
                            handleEditStudentActionClick(student);
                          }}
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          type="button"
                          className="text-red-600 transition hover:text-red-700"
                          title="Delete (UI only)"
                          disabled={
                            isUpdatingStudent &&
                            studentRollNumberBeingSoftDeleted === student.rollNo
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            void handleSoftDeleteStudentActionClick(
                              student.rollNo,
                            );
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

      {/* floating add button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 z-50"
        title="Add student"
        onClick={() => {
          setModalEditRollNo(null);
          setIsModalOpen(true);
        }}
      >
        <FiPlus size={24} />
      </button>

      {/* modal containing the student form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalEditRollNo(null);
        }}
      >
        <Card>
          <CardTitle className="text-center">
            {modalEditRollNo ? "Update Student Details" : "Student Admission"}
          </CardTitle>
          <StudentForm
            editRollNo={modalEditRollNo ?? undefined}
            onSuccess={() => setIsModalOpen(false)}
          />
        </Card>
      </Modal>
    </main>
  );
}
