export type StudentDocument = {
  rollNo: string;
  name: string;
  dob: string;
  course: string;
  photoUrl: string;
  resultPosted: boolean;
  isDelete?: boolean;
  createdAt?: unknown;
};

export type CreateStudentPayload = {
  rollNo: string;
  name: string;
  dob: string;
  course: string;
  photoUrl: string;
};

export type StudentLoginPayload = {
  rollNo: string;
  dob: string;
};
