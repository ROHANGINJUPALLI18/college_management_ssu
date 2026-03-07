"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearAdminSessionFromLocalStorage } from "@/lib/session";
import { mergeClassNames } from "@/lib/utils";

type SidebarProps = {
  activePath: "admission" | "students";
};

export function Sidebar({ activePath }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-full rounded-xl border border-[#dfd7ea] bg-white p-4 md:fixed md:inset-y-0 md:left-0 md:w-72 md:rounded-none md:border-y-0 md:border-l-0 md:border-r md:flex md:flex-col">
      <h2 className="mb-4 text-base font-semibold text-[#2f0a5e]">
        Admin Panel
      </h2>
      <div className="space-y-2 md:flex-1">
        <Link
          href="/admin-dashboard"
          className={mergeClassNames(
            "block rounded-md px-3 py-2 text-sm",
            activePath === "admission"
              ? "bg-[#f0e9fa] text-[#2f0a5e]"
              : "text-[#4d3a67] hover:bg-[#f8f4fc]",
          )}
        >
          Student Admission
        </Link>
        <Link
          href="/admin/students"
          className={mergeClassNames(
            "block rounded-md px-3 py-2 text-sm",
            activePath === "students"
              ? "bg-[#f0e9fa] text-[#2f0a5e]"
              : "text-[#4d3a67] hover:bg-[#f8f4fc]",
          )}
        >
          Student List
        </Link>
      </div>
      <Button
        variant="outline"
        className="mt-6 w-full md:mt-auto"
        onClick={() => {
          clearAdminSessionFromLocalStorage();
          router.push("/admin-login");
        }}
      >
        Logout
      </Button>
    </aside>
  );
}
