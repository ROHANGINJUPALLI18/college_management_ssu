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
    <div className="grid gap-4">
      {subjects.map((subject, subjectIndex) => (
        <div
          key={`subject-${subjectIndex}`}
          className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/30 p-5 shadow-sm transition-all hover:bg-slate-50/50"
        >
          <div className="flex items-center justify-between">
            <Label className="text-[13px] font-bold uppercase tracking-wider text-[#2d1b6b]">
              Subject {subjectIndex + 1}
            </Label>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Input
                value={subject.name}
                onChange={(event) => {
                  onSubjectNameChange(subjectIndex, event.target.value);
                }}
                className="h-11 rounded-xl border-slate-200 bg-white shadow-sm focus:border-[#2d1b6b] focus:ring-[#2d1b6b]"
                placeholder="Enter Subject Name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Input
                value={Number.isNaN(subject.marks) ? "" : subject.marks}
                onChange={(event) => {
                  onSubjectMarksChange(subjectIndex, Number(event.target.value));
                }}
                type="number"
                min={0}
                max={100}
                className="h-11 rounded-xl border-slate-200 bg-white shadow-sm focus:border-[#2d1b6b] focus:ring-[#2d1b6b]"
                placeholder="Enter Marks"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
