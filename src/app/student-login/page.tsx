"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoArrowBack } from "react-icons/io5";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveStudentSessionInLocalStorage } from "@/lib/session";
import { useLoginStudentUsingRollNumberAndDateOfBirthMutation } from "@/store/api/portalApi";

const studentLoginFormSchema = z.object({
  rollNo: z.string().min(3, "Roll number is required."),
  dob: z.string().min(1, "Date of birth is required."),
});

type StudentLoginFormValues = z.infer<typeof studentLoginFormSchema>;

export default function StudentLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loginStudent, { isLoading }] =
    useLoginStudentUsingRollNumberAndDateOfBirthMutation();

  const { register, handleSubmit, formState } = useForm<StudentLoginFormValues>(
    {
      resolver: zodResolver(studentLoginFormSchema),
    },
  );

  async function handleStudentLoginFormSubmit(
    formValues: StudentLoginFormValues,
  ): Promise<void> {
    setErrorMessage("");
    try {
      const student = await loginStudent(formValues).unwrap();
      saveStudentSessionInLocalStorage(student);
      router.push("/student-dashboard");
    } catch (error) {
      setErrorMessage(
        (error as { error?: string })?.error ?? "Unable to login.",
      );
    }
  }

  return (
    <div className="min-h-screen relative">
      <Navbar />
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-md items-center px-4 py-8">
        <Card className="w-full">
          <div className="mb-3 flex">
            <Link href="/">
              <Button
                variant="ghost"
                className="inline-flex items-center gap-2 rounded-md bg-[#efe8f9] px-3 py-2 text-[#2f0a5e] hover:bg-[#e4d8f3]"
                type="button"
              >
                <IoArrowBack className="text-base" aria-hidden="true" />
                <span>Back</span>
              </Button>
            </Link>
          </div>
          <CardTitle className="text-center">Student Login</CardTitle>
          <form
            className="mt-5 space-y-4"
            onSubmit={handleSubmit(handleStudentLoginFormSubmit)}
          >
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
            {errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : null}
            <Button type="submit" className="w-full bg-yellow-300 text-blue-900" disabled={isLoading}>
              {isLoading ? "Validating..." : "Login"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
