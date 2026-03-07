"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoArrowBack } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAdminSessionInLocalStorage } from "@/lib/session";
import { useLoginAdminUsingEmailAndPasswordMutation } from "@/store/api/portalApi";
import { Navbar } from "@/components/navbar";

const adminLoginFormSchema = z.object({
  email: z.email("Invalid email."),
  password: z.string().min(1, "Password is required."),
});

type AdminLoginFormValues = z.infer<typeof adminLoginFormSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loginAdmin, { isLoading }] =
    useLoginAdminUsingEmailAndPasswordMutation();

  const { register, handleSubmit, formState } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginFormSchema),
    defaultValues: {
      email: "admin@university.com",
      password: "admin123",
    },
  });

  async function handleAdminLoginFormSubmit(
    formValues: AdminLoginFormValues,
  ): Promise<void> {
    setErrorMessage("");
    try {
      await loginAdmin(formValues).unwrap();
      saveAdminSessionInLocalStorage();
      router.push("/admin-dashboard");
    } catch (error) {
      setErrorMessage(
        (error as { error?: string })?.error ?? "Unable to login.",
      );
    }
  }

  return (
    <div>
      <Navbar />
      <main className="mx-auto flex min-h-screen w-full max-w-md items-start px-4 pt-18 pb-8">
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
          <CardTitle className="text-center">Admin Login</CardTitle>
          <form
            className="mt-5 space-y-4"
            onSubmit={handleSubmit(handleAdminLoginFormSubmit)}
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              <p className="mt-1 text-xs text-red-600">
                {formState.errors.email?.message}
              </p>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              <p className="mt-1 text-xs text-red-600">
                {formState.errors.password?.message}
              </p>
            </div>
            {errorMessage ? (
              <p className="text-sm text-red-600">{errorMessage}</p>
            ) : null}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Checking..." : "Login"}
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
