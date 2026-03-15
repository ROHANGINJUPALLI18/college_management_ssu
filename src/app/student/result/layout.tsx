"use client";

import { StudentSidebar } from "@/components/student-sidebar";

export default function StudentResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#faf8ff]">
      <StudentSidebar />
      <main className="ml-60 flex-1 p-8">
        <div className="mx-auto max-w-3xl">
          {children}
        </div>
      </main>
    </div>
  );
}
