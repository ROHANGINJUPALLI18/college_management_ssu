// Main navigation bar with logo and menu links
import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => (
  <nav className="bg-white shadow-md py-3 px-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Image
        src="https://www.ssu.ac.in/images/new-ssu-logo.png"
        alt="SSU Logo"
        width={200}
        height={200}
      />
    </div>
    <ul className="hidden md:flex gap-6 font-medium text-[#2a1a5e]">
      <li>
        <Link href="#about">About</Link>
      </li>
      <li>
        <Link href="#programs">Programs</Link>
      </li>
      <li>
        <Link href="#features">Features</Link>
      </li>
      <li>
        <Link href="#news">News</Link>
      </li>
      <li>
        <Link href="#contact">Contact</Link>
      </li>
    </ul>
    <div className="hidden md:flex gap-2">
      <Link href="/admin-login">
        <button className="bg-[#2a1a5e] text-white font-semibold px-4 py-2 rounded hover:bg-[#ffd600] hover:text-[#2a1a5e] transition">
          Admin Login
        </button>
      </Link>
      <Link href="/student-login">
        <button className="bg-[#ffd600] text-[#2a1a5e] font-semibold px-4 py-2 rounded hover:bg-[#2a1a5e] hover:text-white transition">
          Student Login
        </button>
      </Link>
    </div>
    <div className="md:hidden">
      {/* Mobile menu icon placeholder */}
      <button aria-label="Open menu">
        <svg
          className="w-6 h-6 text-[#2a1a5e]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
      {/* Mobile login buttons (optional, for completeness) */}
      <div className="mt-2 flex flex-col gap-2">
        <Link href="/admin-login">
          <button className="bg-[#2a1a5e] text-white font-semibold px-4 py-2 rounded hover:bg-[#ffd600] hover:text-[#2a1a5e] transition">
            Admin Login
          </button>
        </Link>
        <Link href="/student-login">
          <button className="bg-[#ffd600] text-[#2a1a5e] font-semibold px-4 py-2 rounded hover:bg-[#2a1a5e] hover:text-white transition">
            Student Login
          </button>
        </Link>
      </div>
    </div>
  </nav>
);

export default Navbar;
