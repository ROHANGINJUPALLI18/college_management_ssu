"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShimmerBlock, Spinner } from "@/components/ui/loading-state";
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
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);
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
        let uploadedPhotoUrl = existingStudentPhotoUrl;
        if (selectedPhotoFile) {
          setIsPhotoUploading(true);
          uploadedPhotoUrl =
            await uploadStudentPhotoFileToCloudinary(selectedPhotoFile);
          setIsPhotoUploading(false);
        }

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

      setIsPhotoUploading(true);
      const photoUrl =
        await uploadStudentPhotoFileToCloudinary(selectedPhotoFile);
      setIsPhotoUploading(false);
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
    } finally {
      setIsPhotoUploading(false);
    }
  }

  const isFormSubmitting =
    formState.isSubmitting || isLoading || isUpdateLoading || isPhotoUploading;

  return (
    <form
      className="mt-1 flex flex-col gap-3"
      onSubmit={handleSubmit(handleStudentAdmissionFormSubmit)}
    >
      {isStudentEditMode && isExistingStudentLoading ? (
        <div className="space-y-3 py-1">
          <ShimmerBlock className="h-4 w-40" />
          <ShimmerBlock className="h-10 w-full rounded-lg" />
          <ShimmerBlock className="h-10 w-full rounded-lg" />
          <ShimmerBlock className="h-10 w-full rounded-lg" />
        </div>
      ) : null}

      <div className="flex flex-col space-y-1">
        <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
          Name
        </Label>
        <Input
          id="name"
          placeholder="Enter full name"
          className="h-10 rounded-lg border-slate-200 outline-none placeholder:text-slate-400 focus:border-[#2d1b6b] focus:ring-[#2d1b6b] shadow-sm transition-all"
          {...register("name")}
        />
        <p className="min-h-[12px] text-[10px] font-medium text-red-500">
          {formState.errors.name?.message}
        </p>
      </div>

      <div className="flex flex-col space-y-1">
        <Label
          htmlFor="rollNo"
          className="text-xs font-semibold text-slate-700"
        >
          Roll Number
        </Label>
        <Input
          id="rollNo"
          placeholder="Enter roll number"
          className="h-10 rounded-lg border-slate-200 outline-none placeholder:text-slate-400 focus:border-[#2d1b6b] focus:ring-[#2d1b6b] shadow-sm transition-all disabled:opacity-70 disabled:bg-slate-50"
          {...register("rollNo")}
          disabled={isStudentEditMode}
        />
        <p className="min-h-[12px] text-[10px] font-medium text-red-500">
          {formState.errors.rollNo?.message}
        </p>
      </div>

      <div className="flex flex-col space-y-1">
        <Label htmlFor="dob" className="text-xs font-semibold text-slate-700">
          Date of Birth
        </Label>
        <Input
          id="dob"
          type="date"
          className="h-10 rounded-lg border-slate-200 outline-none text-slate-700 placeholder:text-slate-400 focus:border-[#2d1b6b] focus:ring-[#2d1b6b] shadow-sm transition-all"
          {...register("dob")}
        />
        <p className="min-h-[12px] text-[10px] font-medium text-red-500">
          {formState.errors.dob?.message}
        </p>
      </div>

      <div className="flex flex-col space-y-1">
        <Label
          htmlFor="course"
          className="text-xs font-semibold text-slate-700"
        >
          Course
        </Label>
        <Input
          id="course"
          placeholder="Enter course name"
          className="h-10 rounded-lg border-slate-200 outline-none placeholder:text-slate-400 focus:border-[#2d1b6b] focus:ring-[#2d1b6b] shadow-sm transition-all"
          {...register("course")}
        />
        <p className="min-h-[12px] text-[10px] font-medium text-red-500">
          {formState.errors.course?.message}
        </p>
      </div>

      <div className="flex flex-col space-y-1">
        <Label
          htmlFor="studentPhoto"
          className="text-xs font-semibold text-slate-700"
        >
          Photo
        </Label>
        <div className="flex w-full overflow-hidden items-center rounded-lg border-2 border-dashed border-slate-300/80 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <Input
            id="studentPhoto"
            type="file"
            accept="image/*"
            disabled={isFormSubmitting}
            className="h-auto w-full cursor-pointer p-0 border-0 bg-transparent text-xs text-slate-500 shadow-none file:mr-3 file:border-0 file:bg-slate-200 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#32236a] hover:file:bg-slate-300 transition-all focus-visible:ring-0"
            onChange={(event) => {
              setSelectedPhotoFile(event.target.files?.[0] ?? null);
            }}
          />
        </div>
      </div>

      {errorMessage ? (
        <p className="text-xs font-medium text-red-500">{errorMessage}</p>
      ) : null}
      {successMessage ? (
        <p className="text-xs font-medium text-green-600">{successMessage}</p>
      ) : null}

      <Button
        type="submit"
        disabled={isFormSubmitting}
        className="mt-3 h-10 w-full rounded-lg bg-[#2b1f63] text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-[#322365] hover:shadow-lg disabled:opacity-70"
      >
        {isFormSubmitting ? (
          <Spinner className="mr-2 h-4 w-4" />
        ) : (
          <UserPlus className="mr-2 h-4 w-4" />
        )}
        {isFormSubmitting
          ? isPhotoUploading
            ? "Uploading Photo..."
            : isStudentEditMode
              ? "Saving..."
              : "Submitting..."
          : isStudentEditMode
            ? "Save Changes"
            : "Submit Record"}
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
    <div className="flex min-h-screen bg-[#f8fafc] overflow-x-hidden">
      <Sidebar activePath="students" />

      <main className="flex-1 flex flex-col items-center p-6 md:ml-[280px] md:py-12">
        <div className="w-full max-w-[640px] px-4">
          <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] ring-1 ring-slate-100">
            <div className="bg-[#2d1b6b] px-8 py-8 text-center text-white">
              <h1 className="text-2xl font-bold tracking-tight">
                {editRollNoFromQueryParameter
                  ? "Update Student Details"
                  : "Student Admission"}
              </h1>
              <p className="mt-2 text-sm font-medium text-indigo-200">
                Enrollment Application Form
              </p>
            </div>
            <div className="px-8 pb-10 pt-6">
              <StudentForm editRollNo={editRollNoFromQueryParameter} />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
