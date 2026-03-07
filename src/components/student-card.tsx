import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import type { StudentDocument } from "@/types/student";

type StudentCardProps = {
  student: StudentDocument;
  onStudentCardClick: (student: StudentDocument) => void;
};

export function StudentCard({ student, onStudentCardClick }: StudentCardProps) {
  return (
    <button
      className="w-full text-left"
      onClick={() => {
        onStudentCardClick(student);
      }}
    >
      <Card className="transition hover:border-[#c7b4de]">
        <CardTitle>{student.name}</CardTitle>
        <CardDescription className="mt-2">
          Roll No: {student.rollNo}
        </CardDescription>
        <CardDescription>Course: {student.course}</CardDescription>
      </Card>
    </button>
  );
}
