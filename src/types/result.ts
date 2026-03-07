export type SubjectMark = {
  name: string;
  marks: number;
};

export type ResultDocument = {
  rollNo: string;
  subjects: SubjectMark[];
};

export type CreateOrUpdateResultPayload = {
  rollNo: string;
  subjects: SubjectMark[];
};
