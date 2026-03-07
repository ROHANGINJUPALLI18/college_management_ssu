import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
        <section className="flex flex-col justify-center rounded-2xl bg-[var(--portal-primary)] p-8 text-white">
          <h1 className="mt-4 text-4xl leading-tight md:text-5xl">
            Welcome to
            <br />
            Sikkim Skill University
          </h1>
          <p className="mt-4 max-w-md text-sm text-[#d9cde9]">
            Access semester results, verify academic records, and manage student
            performance updates through a secure university workflow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/student-login">
              <Button variant="accent">Student Login</Button>
            </Link>
            <Link href="/admin-login">
              <Button
                variant="outline"
                className="border-[#cab8e6] bg-transparent text-white hover:bg-[#3e1a72]"
              >
                Admin Login
              </Button>
            </Link>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-[#ddd5e8] bg-white p-3">
          <div className="relative h-[320px] w-full overflow-hidden rounded-xl md:h-[420px]">
            <Image
              src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1400&q=80"
              alt="University building"
              fill
              className="object-cover"
              priority
            />
          </div>
        </section>
      </main>
    </div>
  );
}
