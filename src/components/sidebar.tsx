"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearAdminSessionFromLocalStorage } from "@/lib/session";
import { mergeClassNames } from "@/lib/utils";

type SidebarProps = {
  /**
   * currently the sidebar only contains a student list link; the prop is
   * optional to allow rendering from pages where there's no highlight.
   */
  activePath?: "students";
};

export function Sidebar({ activePath }: SidebarProps) {
  const router = useRouter();

  return (
    <aside className="w-full rounded-xl border border-[#dfd7ea] bg-white p-4 md:fixed md:inset-y-0 md:left-0 md:w-72 md:rounded-none md:border-y-0 md:border-l-0 md:border-r md:flex md:flex-col">
      <div className="mb-4 flex justify-between items-center  gap-2">
        <Link href="/" className="block">
          <Image
            src="https://www.ssu.ac.in/images/new-ssu-logo.png"
            alt="SSU logo"
            width={200}
            height={80}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <span className="text-base font-semibold text-[#2f0a5e]">
          Admin Panel
        </span>
      </div>
      <div className="space-y-2 md:flex-1 mt-4">
        <Link
          href="/admin/students"
          className={mergeClassNames(
            "block rounded-md px-3 py-2 text-sm",
            activePath === "students"
              ? "bg-yellow-300 text-[#2f0a5e]"
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
