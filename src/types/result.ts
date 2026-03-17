export type SubjectMark = {
  name: string;
  marks: number;
};

export type ResultDocument = {
  id: string;
  rollNo: string;
  heading: string;
  subjects: SubjectMark[];
  createdAt?: string;
};

export type CreateOrUpdateResultPayload = {
  rollNo: string;
  heading: string;
  subjects: SubjectMark[];
};

export type UpdateResultPayload = {
  resultId: string;
  heading: string;
  subjects: SubjectMark[];
};
