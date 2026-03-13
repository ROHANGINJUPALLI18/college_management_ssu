import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="border-b border-[#dfd7ea] bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="block">
          <Image
            src="https://www.ssu.ac.in/images/new-ssu-logo.png"
            alt="Sikkim Skill University Logo"
            width={280}
            height={64}
            priority
            className="h-14 w-auto md:h-16"
          />
        </Link>
        <div className="flex gap-2">
          <Link href="/student-login">
            <Button className="bg-yellow-300" variant="outline">Student Login</Button>
          </Link>
          <Link href="/admin-login">
            <Button>Admin Login</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
