import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import type { StudentDocument } from "@/types/student";

type StudentIdCardProps = {
  student: StudentDocument;
};

export function StudentIDCard({ student }: StudentIdCardProps) {
  return (
    <Card className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative h-28 w-24 overflow-hidden rounded-md border border-[#ded7ea]">
        <Image
          src={student.photoUrl}
          alt={`${student.name} profile`}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div>
        <CardTitle>Student ID Card</CardTitle>
        <p className="mt-2 text-sm text-[#4a3a60]">Name: {student.name}</p>
        <p className="text-sm text-[#4a3a60]">Roll Number: {student.rollNo}</p>
        <p className="text-sm text-[#4a3a60]">Course: {student.course}</p>
      </div>
    </Card>
  );
}
