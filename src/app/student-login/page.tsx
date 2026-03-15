"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lightbulb, Pencil, MessageSquare, BookOpen, Send, ArrowLeft } from "lucide-react";
import { saveStudentSessionInLocalStorage } from "@/lib/session";
import { useLoginStudentUsingRollNumberAndDateOfBirthMutation } from "@/store/api/portalApi";
import { Navbar } from "@/components/navbar";

const studentLoginFormSchema = z.object({
  rollNo: z.string().min(3, "Roll number is required."),
  dob: z.string().min(1, "Date of birth is required."),
  rememberMe: z.boolean().optional(),
});

type StudentLoginFormValues = z.infer<typeof studentLoginFormSchema>;

export default function StudentLoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [loginStudent, { isLoading }] = useLoginStudentUsingRollNumberAndDateOfBirthMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<StudentLoginFormValues>({
    resolver: zodResolver(studentLoginFormSchema),
    defaultValues: {
      rollNo: "",
      dob: "",
      rememberMe: false,
    },
  });

  async function handleStudentLoginFormSubmit(formValues: StudentLoginFormValues): Promise<void> {
    setErrorMessage("");
    try {
      const student = await loginStudent(formValues).unwrap();
      saveStudentSessionInLocalStorage(student);
      router.push("/student-dashboard");
    } catch (error) {
      setErrorMessage((error as { error?: string })?.error ?? "Unable to login.");
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white font-sans overflow-hidden font-body relative">
      <Navbar />

      {/* FLIPPED LAYOUT using lg:flex-row-reverse */}
      <main className="flex-1 flex flex-col lg:flex-row-reverse w-full min-h-0 relative group/main">

        {/* Global Back Button (Top Left) */}
        <Link
          href="/"
          className="absolute top-6 left-6 lg:top-8 lg:left-8 z-50 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-100 text-[#2f0a5e] hover:bg-white transition-all transform hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(47,10,94,0.15)]"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        {/* Right Side (visually): Login Form */}
        <div className="w-full lg:w-[45%] flex justify-center p-8 sm:p-12 lg:p-16 xl:p-20 relative z-10 bg-white items-center border-l lg:border-l-0 lg:border-r border-[#dfd7ea]">
          <div className="w-full max-w-[420px]">
            <div className="text-center lg:text-left mb-8">
              <h1 className="text-[32px] sm:text-[36px] font-bold text-[#111111] font-sans tracking-tight">Student Login</h1>
            </div>

            <form onSubmit={handleSubmit(handleStudentLoginFormSubmit)} className="space-y-4">
              <div className="space-y-1">
                <input
                  id="rollNo"
                  type="text"
                  placeholder="Enter roll number"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-[10px] text-[15px] text-[#111] placeholder:text-gray-400 focus:border-[#f6b100] focus:outline-none focus:ring-1 focus:ring-[#f6b100] transition-colors"
                  {...register("rollNo")}
                />
                {errors.rollNo && (
                  <p className="text-xs text-red-500">{errors.rollNo.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <input
                  id="dob"
                  type="date"
                  placeholder="Select date of birth"
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-[10px] text-[15px] text-[#111] placeholder:text-gray-400 focus:border-[#f6b100] focus:outline-none focus:ring-1 focus:ring-[#f6b100] transition-colors uppercase"
                  {...register("dob")}
                />
                {errors.dob && (
                  <p className="text-xs text-red-500">{errors.dob.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-[14px] pt-1 pb-2">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="rounded border border-gray-300 text-[#f6b100] cursor-pointer focus:border-[#f6b100] focus:ring focus:ring-[#f6b100] focus:ring-opacity-20 w-4 h-4"
                    {...register("rememberMe")}
                  />
                  <span className="text-gray-600 group-hover:text-[#f6b100] transition-colors">Remember me</span>
                </label>
                <Link href="#" className="text-[#2f0a5e] hover:underline font-medium">
                  Login help?
                </Link>
              </div>

              {errorMessage && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-center pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex w-[120px] items-center justify-center rounded-[4px] bg-[#f6b100] px-4 py-2 text-[15px] font-medium text-[#2f0a5e] shadow-sm hover:bg-[#ffc107] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-[#2f0a5e]" /> : "Log in"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Left Side (visually): Decorative Pattern (Desktop Only) */}
        <div className="hidden lg:flex lg:flex-1 relative bg-[#FDFBF7] overflow-hidden items-center justify-center h-full">

          {/* Floating visual elements representing the reference image using Theme Colors (Purple & Yellow) */}
          <div className="absolute inset-0 w-full h-full opacity-[0.80] pointer-events-none">

            {/* Top Region */}
            <div className="absolute top-[8%] left-[20%] flex items-center justify-center w-[72px] h-[55px] bg-[#2f0a5e] rounded-[10px] shadow-[6px_6px_0_1px_rgba(246,177,0,0.6)] -rotate-6 animate-[bounce_4s_infinite]">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>

            <div className="absolute top-[5%] left-[60%] flex drop-shadow-lg">
              <Pencil className="h-16 w-16 text-[#f6b100] rotate-[35deg] fill-white" strokeWidth={1.5} />
            </div>

            <div className="absolute top-[18%] right-[15%] flex items-center justify-center w-[60px] h-[60px] bg-white rounded shadow-md border-r-4 border-b-4 border-[#f6b100] rotate-[-12deg]">
              <BookOpen className="h-8 w-8 text-[#2f0a5e]" />
            </div>

            <div className="absolute top-[32%] right-[25%] flex items-center justify-center w-[50px] h-[65px] bg-white border border-[#2f0a5e] border-b-[6px] rounded-full shadow-lg -rotate-12 animate-[pulse_5s_infinite]">
              <Lightbulb className="h-7 w-7 text-[#f6b100] fill-[#f6b100]" />
            </div>

            {/* Middle Region */}
            <div className="absolute top-[38%] left-[25%] flex drop-shadow-[4px_4px_0_rgba(246,177,0,0.4)]">
              <Send className="h-16 w-16 text-[#2f0a5e] -rotate-12 fill-[#f6b100]" strokeWidth={1} />
            </div>

            <div className="absolute top-[48%] left-[65%] flex items-center justify-center w-[65px] h-[48px] bg-white rounded-[10px] shadow-sm border-2 border-[#2f0a5e] border-r-[5px] border-b-[5px] rotate-3">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-[#f6b100] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#f6b100] rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-[#f6b100] rounded-full"></div>
              </div>
            </div>

            <div className="absolute top-[62%] right-[12%] flex items-center justify-center w-[75px] h-[70px] bg-white rounded shadow-md border-r-4 border-b-4 border-[#2f0a5e] -rotate-6">
              <BookOpen className="h-9 w-9 text-[#f6b100] shrink-0" />
            </div>

            {/* Bottom Region */}
            <div className="absolute bottom-[28%] left-[52%] flex drop-shadow-md rotate-[-40deg]">
              <Pencil className="h-[72px] w-[72px] text-[#f6b100] fill-[#2f0a5e] stroke-[1px]" />
            </div>

            <div className="absolute bottom-[22%] left-[15%] flex items-center justify-center w-[65px] h-[60px] bg-white rounded shadow-md border-l-4 border-b-4 border-[#2f0a5e] rotate-[10deg] animate-[bounce_5s_infinite_reverse]">
              <BookOpen className="h-8 w-8 text-[#f6b100]" />
            </div>

            <div className="absolute bottom-[5%] left-[30%] flex drop-shadow-[5px_5px_0_rgba(47,10,94,0.5)]">
              <Pencil className="h-16 w-16 text-[#f6b100] rotate-[45deg] fill-[#f6b100]" />
            </div>

            <div className="absolute bottom-[8%] left-[62%] flex items-center justify-center w-[55px] h-[50px] bg-[#f6b100] rounded shadow-[5px_5px_0_1px_rgba(47,10,94,0.3)] border border-[#2f0a5e] -rotate-[15deg]">
              <BookOpen className="h-7 w-7 text-[#2f0a5e]" />
            </div>

            <div className="absolute bottom-[22%] right-[25%] animate-[bounce_6s_infinite] drop-shadow-[3px_3px_0_rgba(47,10,94,0.4)]">
              <Send className="h-14 w-14 text-[#f6b100] -rotate-[35deg] fill-[#f6b100]" />
            </div>

            <div className="absolute bottom-[6%] right-[8%] flex items-center justify-center w-[50px] h-[70px] bg-white border border-[#2f0a5e] border-b-[6px] rounded-full shadow-lg rotate-[20deg]">
              <Lightbulb className="h-7 w-7 text-[#2f0a5e] fill-[#2f0a5e]" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
