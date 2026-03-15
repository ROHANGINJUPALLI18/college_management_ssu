import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { StudentDocument } from "@/types/student";

type StudentIdCardProps = {
  student: StudentDocument;
};

export function StudentIDCard({ student }: StudentIdCardProps) {
  return (
    <Card className="overflow-hidden border border-[#e8e0f5] bg-white shadow-sm !p-0">
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#2f0a5e] via-[#f6b100] to-[#2f0a5e]" />

      <div className="flex flex-col sm:flex-row items-center sm:items-stretch p-6 gap-6">
        {/* Photo */}
        <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg ring-2 ring-[#f6b100]/40 shadow-sm">
          <Image
            src={student.photoUrl}
            alt={`${student.name} profile`}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px bg-[#f0eaf8]" />

        {/* Info */}
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f6b100] mb-0.5">
              Full Name
            </p>
            <p className="text-xl font-extrabold text-[#2f0a5e] leading-tight">
              {student.name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-0.5">
                Roll Number
              </p>
              <p className="text-sm font-bold text-[#2f0a5e]">{student.rollNo}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-0.5">
                Course
              </p>
              <p className="text-sm font-bold text-[#2f0a5e]">{student.course}</p>
            </div>
          </div>
        </div>

        {/* SSU badge */}
        <div className="hidden lg:flex flex-col items-end justify-center gap-1 shrink-0">
          <span className="inline-flex rounded-full bg-[#2f0a5e] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f6b100]">
            SSU
          </span>
        </div>
      </div>
    </Card>
  );
}
