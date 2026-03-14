"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Users, LogOut } from "lucide-react";
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
    <aside className="fixed inset-y-0 left-0 flex w-72 flex-col border-r border-gray-200 bg-white p-8 md:w-[280px]">
      <div className="mb-10 flex flex-col items-center border-b border-gray-100 pb-10">
        <Link href="/" className="flex flex-col items-center gap-5 text-center">
          <Image
            src="https://www.ssu.ac.in/images/new-ssu-logo.png"
            alt="SSU logo"
            width={96}
            height={96}
            className="h-24 w-24 object-contain"
            priority
          />
          <h2 className="text-[15px] font-extrabold uppercase tracking-[0.15em] text-[#2d1b6b]">
            Admin Panel
          </h2>
        </Link>
      </div>

      <div className="flex-1 space-y-2">
        <Link
          href="/admin/students"
          className={mergeClassNames(
            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all shadow-sm",
            activePath === "students"
              ? "bg-[#fdce2a] text-gray-900"
              : "border border-transparent text-gray-600 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900",
          )}
        >
          <Users className="h-5 w-5" />
          Student List
        </Link>
      </div>

      <div className="mt-auto pt-6">
        <Button
          variant="outline"
          className="group flex h-auto w-full items-center justify-between rounded-xl border-gray-200 bg-white px-4 py-3.5 shadow-sm transition-colors hover:bg-gray-50"
          onClick={() => {
            clearAdminSessionFromLocalStorage();
            router.push("/admin-login");
          }}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600">
              N
            </div>
            <span className="text-sm font-semibold text-gray-700">Logout</span>
          </div>
          <LogOut className="h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600" />
        </Button>
      </div>
    </aside>
  );
}
