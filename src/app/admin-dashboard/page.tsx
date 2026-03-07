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
import { useCreateSingleStudentRecordMutation } from "@/store/api/portalApi";

const studentAdmissionFormSchema = z.object({
  name: z.string().min(2, "Name is required."),
  rollNo: z.string().min(3, "Roll number is required."),
  dob: z.string().min(1, "Date of birth is required."),
  course: z.string().min(2, "Course is required."),
});

type StudentAdmissionFormValues = z.infer<typeof studentAdmissionFormSchema>;

export default function AdminDashboardPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);
  const [createStudent, { isLoading }] = useCreateSingleStudentRecordMutation();

  const { register, handleSubmit, reset, formState } =
    useForm<StudentAdmissionFormValues>({
      resolver: zodResolver(studentAdmissionFormSchema),
    });

  useEffect(() => {
    if (!isAdminSessionAuthenticatedInLocalStorage()) {
      router.replace("/admin-login");
    }
  }, [router]);

  async function handleStudentAdmissionFormSubmit(
    formValues: StudentAdmissionFormValues,
  ): Promise<void> {
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedPhotoFile) {
      setErrorMessage("Student photo is required.");
      return;
    }

    try {
      const photoUrl =
        await uploadStudentPhotoFileToCloudinary(selectedPhotoFile);
      await createStudent({
        ...formValues,
        photoUrl,
      }).unwrap();

      setSuccessMessage("Student admitted successfully.");
      setSelectedPhotoFile(null);
      reset();
    } catch (error) {
      setErrorMessage(
        (error as { error?: string })?.error ?? "Unable to create student.",
      );
    }
  }

  return (
    <main className="w-full px-4 py-8 md:pl-80 md:pr-8">
      <Sidebar activePath="admission" />

      <div className="mx-auto w-1/2 mt-3 max-w-5xl">
        <Card>
          <CardTitle className="text-center" >Student Admission</CardTitle>
          <form
            className="mt-5 grid gap-4"
            onSubmit={handleSubmit(handleStudentAdmissionFormSubmit)}
          >
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              <p className="mt-1 text-xs text-red-600">
                {formState.errors.name?.message}
              </p>
            </div>
            <div>
              <Label htmlFor="rollNo">Roll Number</Label>
              <Input id="rollNo" {...register("rollNo")} />
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
            </div>

            {errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : null}
            {successMessage ? (
              <p className="text-sm text-green-700">{successMessage}</p>
            ) : null}

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Admission"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
