import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SubjectFormValue = {
  name: string;
  marks: number;
};

type ResultSubjectFieldsProps = {
  subjects: SubjectFormValue[];
  onSubjectNameChange: (subjectIndex: number, name: string) => void;
  onSubjectMarksChange: (subjectIndex: number, marks: number) => void;
};

export function ResultSubjectFields({
  subjects,
  onSubjectNameChange,
  onSubjectMarksChange,
}: ResultSubjectFieldsProps) {
  return (
    <div className="grid gap-3">
      {subjects.map((subject, subjectIndex) => (
        <div
          key={`subject-${subjectIndex}`}
          className="grid gap-2 rounded-md border border-[#e7dff1] p-3"
        >
          <Label>Subject {subjectIndex + 1}</Label>
          <Input
            value={subject.name}
            onChange={(event) => {
              onSubjectNameChange(subjectIndex, event.target.value);
            }}
            placeholder="Subject Name"
          />
          <Input
            value={Number.isNaN(subject.marks) ? "" : subject.marks}
            onChange={(event) => {
              onSubjectMarksChange(subjectIndex, Number(event.target.value));
            }}
            type="number"
            min={0}
            max={100}
            placeholder="Marks"
          />
        </div>
      ))}
    </div>
  );
}
