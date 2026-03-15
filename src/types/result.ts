export type SubjectMark = {
  name: string;
  marks: number;
};

export type ResultDocument = {
  rollNo: string;
  heading: string;
  subjects: SubjectMark[];
};

export type CreateOrUpdateResultPayload = {
  rollNo: string;
  heading: string;
  subjects: SubjectMark[];
};
