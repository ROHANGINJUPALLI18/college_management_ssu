"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadStudentPhotoFileToCloudinary } from "@/lib/cloudinary";
import { isAdminSessionAuthenticatedInLocalStorage } from "@/lib/session";
import {
  useCreateSingleStudentRecordMutation,
  useGetSingleStudentByRollNumberQuery,
  useUpdateSingleStudentRecordMutation,
} from "@/store/api/portalApi";

const studentAdmissionFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  rollNo: z.string().min(3, "Roll number is required."),
  dob: z.string().min(1, "Date of birth is required."),
  course: z.string().min(2, "Course is required."),
});

type StudentAdmissionFormValues = z.infer<typeof studentAdmissionFormSchema>;

export type StudentFormProps = {
  /** if provided the form switches to edit mode */
  editRollNo?: string;
  /** called when the form succeeds (useful for closing a modal) */
  onSuccess?: () => void;
};

/**
 * Reusable student form used for both the standalone admin dashboard and
 * modal dialogs on the student list page.  The component handles all
 * validation, file uploads, create/update logic and optional navigation
 * behaviour.  When `onSuccess` is supplied the component will call it
 * instead of performing any router navigation so the parent component can
 * react (for example closing a modal).
 */
export function StudentForm({ editRollNo, onSuccess }: StudentFormProps) {
  const router = useRouter();
  const isStudentEditMode = Boolean(editRollNo);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [createStudent, { isLoading }] = useCreateSingleStudentRecordMutation();
  const [updateStudentRecord, { isLoading: isUpdateLoading }] =
    useUpdateSingleStudentRecordMutation();

  const { data: existingStudentDetails, isLoading: isExistingStudentLoading } =
    useGetSingleStudentByRollNumberQuery(editRollNo ?? "", {
      skip: !editRollNo,
    });

  const { register, handleSubmit, reset, formState } =
    useForm<StudentAdmissionFormValues>({
      resolver: zodResolver(studentAdmissionFormSchema),
    });

  useEffect(() => {
    if (!isAdminSessionAuthenticatedInLocalStorage()) {
      router.replace("/admin-login");
    }
  }, [router]);

  useEffect(() => {
    if (!existingStudentDetails) {
      return;
    }

    reset({
      name: existingStudentDetails.name,
      rollNo: existingStudentDetails.rollNo,
      dob: existingStudentDetails.dob,
      course: existingStudentDetails.course,
    });
  }, [existingStudentDetails, reset]);

  const existingStudentPhotoUrl = existingStudentDetails?.photoUrl ?? "";

  async function handleStudentAdmissionFormSubmit(
    formValues: StudentAdmissionFormValues,
  ): Promise<void> {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isStudentEditMode && editRollNo) {
        const uploadedPhotoUrl = selectedPhotoFile
          ? await uploadStudentPhotoFileToCloudinary(selectedPhotoFile)
          : existingStudentPhotoUrl;

        await updateStudentRecord({
          rollNo: editRollNo,
          payload: {
            name: formValues.name,
            dob: formValues.dob,
            course: formValues.course,
            photoUrl: uploadedPhotoUrl,
          },
        }).unwrap();

        setSuccessMessage("Student details updated successfully.");

        if (onSuccess) {
          onSuccess();
          return;
        }

        // fall back to original behaviour when not inside a modal
        router.push("/admin/students");
        return;
      }

      if (!selectedPhotoFile) {
        setErrorMessage("Student photo is required.");
        return;
      }

      const photoUrl =
        await uploadStudentPhotoFileToCloudinary(selectedPhotoFile);
      await createStudent({ ...formValues, photoUrl }).unwrap();

      setSuccessMessage("Student admitted successfully.");
      setSelectedPhotoFile(null);
      reset();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setErrorMessage(
        (error as { error?: string })?.error ??
          (isStudentEditMode
            ? "Unable to update student details."
            : "Unable to create student."),
      );
    }
  }

  const isFormSubmitting = isLoading || isUpdateLoading;

  return (
    <form
      className="mt-5 grid gap-4"
      onSubmit={handleSubmit(handleStudentAdmissionFormSubmit)}
    >
      {isStudentEditMode && isExistingStudentLoading ? (
        <p className="text-sm text-[#675f74]">Loading student details...</p>
      ) : null}

      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        <p className="mt-1 text-xs text-red-600">
          {formState.errors.name?.message}
        </p>
      </div>

      <div>
        <Label htmlFor="rollNo">Roll Number</Label>
        <Input
          id="rollNo"
          {...register("rollNo")}
          disabled={isStudentEditMode}
        />
        <p className="mt-1 text-xs text-red-600">
          {formState.errors.rollNo?.message}
        </p>
      </div>

      <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Input id="dob" type="date" {...register("dob")} />
        <p className="mt-1 text-xs text-red-600">
          {formState.errors.dob?.message}
        </p>
      </div>

      <div>
        <Label htmlFor="course">Course</Label>
        <Input id="course" {...register("course")} />
        <p className="mt-1 text-xs text-red-600">
          {formState.errors.course?.message}
        </p>
      </div>

      <div>
        <Label htmlFor="studentPhoto">Student Photo</Label>
        <Input
          id="studentPhoto"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null;
            setSelectedPhotoFile(file);
          }}
        />
        {isStudentEditMode ? (
          <p className="mt-1 text-xs text-[#675f74]">
            Optional in edit mode. Upload only if you want to replace current
            photo.
          </p>
        ) : null}
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600">{errorMessage}</p>
      ) : null}
      {successMessage ? (
        <p className="text-sm text-green-700">{successMessage}</p>
      ) : null}

      <Button type="submit" disabled={isFormSubmitting}>
        {isFormSubmitting
          ? isStudentEditMode
            ? "Saving..."
            : "Submitting..."
          : isStudentEditMode
            ? "Save Student Details"
            : "Submit Admission"}
      </Button>
    </form>
  );
}

// admin-dashboard-form page wrapper now simply renders the sidebar and the
// shared form component.  We keep this export for backwards compatibility
// and to preserve the route behaviour.

type AdminDashboardFormProps = {
  editRollNoFromQueryParameter: string;
};

export function AdminDashboardForm({
  editRollNoFromQueryParameter,
}: AdminDashboardFormProps) {
  return (
    <main className="w-full px-4 py-8 md:pl-80 md:pr-8">
      <Sidebar activePath="students" />

      <div className="mx-auto mt-3 w-1/2 max-w-5xl">
        <Card>
          <CardTitle className="text-center">
            {editRollNoFromQueryParameter
              ? "Update Student Details"
              : "Student Admission"}
          </CardTitle>
          <StudentForm editRollNo={editRollNoFromQueryParameter} />
        </Card>
      </div>
    </main>
  );
}
