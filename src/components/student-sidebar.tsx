"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, LogOut } from "lucide-react";
import { clearStudentSessionFromLocalStorage } from "@/lib/session";
import { mergeClassNames } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/student-dashboard" },
];

export function StudentSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 flex w-60 flex-col bg-[#2f0a5e] text-white">

      {/* Logo area */}
      <Link
        href="/"
        className="flex flex-col items-center gap-3 px-6 py-7 border-b border-white/10 hover:bg-white/5 transition-colors"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-md">
          <Image
            src="https://www.ssu.ac.in/images/new-ssu-logo.png"
            alt="SSU logo"
            width={48}
            height={48}
            className="h-11 w-11 object-contain"
            priority
          />
        </div>
        <div className="text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-white leading-tight">
            Sikkim Skill
          </p>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-white leading-tight">
            University
          </p>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f6b100]/80">
            Student Panel
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const basePath = item.path.split("#")[0];
          const isActive =
            pathname === basePath || pathname.startsWith(basePath + "/");

          return (
            <Link
              key={item.name}
              href={item.path}
              className={mergeClassNames(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all duration-150",
                isActive
                  ? "bg-[#f6b100] text-[#2f0a5e]"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon
                className={mergeClassNames(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-[#2f0a5e]" : "text-white/50"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-white/10 pt-4">
        <button
          onClick={() => {
            clearStudentSessionFromLocalStorage();
            router.push("/student-login");
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-white/50 hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <LogOut className="h-4 w-4 shrink-0 text-white/40" />
          Logout
        </button>
      </div>
    </aside>
  );
}
