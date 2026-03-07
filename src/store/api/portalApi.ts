import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  authenticateStudentUsingRollNumberAndDateOfBirth,
  createStudent,
  getStudentByRollNo,
  getStudents,
  updateStudent,
} from "@/services/studentService";
import {
  createResult,
  getResultByRollNo,
  updateResult,
} from "@/services/resultService";
import type {
  CreateStudentPayload,
  StudentDocument,
  StudentLoginPayload,
} from "@/types/student";
import type { CreateOrUpdateResultPayload, ResultDocument } from "@/types/result";

const ADMIN_EMAIL = "admin@university.com";
const ADMIN_PASSWORD = "admin123";

export const portalApi = createApi({
  reducerPath: "portalApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Students", "Results"],
  endpoints: (buildEndpoint) => ({
    loginStudentUsingRollNumberAndDateOfBirth: buildEndpoint.mutation<
      StudentDocument,
      StudentLoginPayload
    >({
      async queryFn(studentLoginPayload) {
        try {
          const student =
            await authenticateStudentUsingRollNumberAndDateOfBirth(
              studentLoginPayload,
            );

          if (!student) {
            return {
              error: {
                status: "CUSTOM_ERROR",
                error: "Invalid roll number or date of birth.",
              },
            };
          }

          return { data: student };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: (error as Error).message,
            },
          };
        }
      },
    }),
    loginAdminUsingEmailAndPassword: buildEndpoint.mutation<
      { authenticated: true },
      { email: string; password: string }
    >({
      queryFn({ email, password }) {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          return { data: { authenticated: true } };
        }

        return {
          error: {
            status: "CUSTOM_ERROR",
            error: "Invalid admin credentials.",
          },
        };
      },
    }),
    getAllStudentsFromFirestore: buildEndpoint.query<StudentDocument[], void>({
      async queryFn() {
        try {
          const students = await getStudents();
          return { data: students };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: (error as Error).message,
            },
          };
        }
      },
      providesTags: ["Students"],
    }),
    getSingleStudentByRollNumber: buildEndpoint.query<StudentDocument | null, string>({
      async queryFn(rollNo) {
        try {
          const student = await getStudentByRollNo(rollNo);
          return { data: student };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: (error as Error).message,
            },
          };
        }
      },
      providesTags: ["Students"],
    }),
    createSingleStudentRecord: buildEndpoint.mutation<void, CreateStudentPayload>({
      async queryFn(studentPayload) {
        try {
          await createStudent(studentPayload);
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: (error as Error).message,
            },
          };
        }
      },
      invalidatesTags: ["Students"],
    }),
    updateSingleStudentRecord: buildEndpoint.mutation<
      void,
      { rollNo: string; payload: Partial<StudentDocument> }
    >({
      async queryFn({ rollNo, payload }) {
        try {
          await updateStudent(rollNo, payload);
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: (error as Error).message,
            },
          };
        }
      },
      invalidatesTags: ["Students"],
    }),
    createStudentResultAndUpdateStudentPostingFlag: buildEndpoint.mutation<
      void,
      CreateOrUpdateResultPayload
    >({
      async queryFn(payload) {
        try {
          await createResult(payload);
          await updateStudent(payload.rollNo, { resultPosted: true });
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: (error as Error).message,
            },
          };
        }
      },
      invalidatesTags: ["Students", "Results"],
    }),
    getStudentResultByRollNumber: buildEndpoint.query<ResultDocument | null, string>({
      async queryFn(rollNo) {
        try {
          const result = await getResultByRollNo(rollNo);
          return { data: result };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: (error as Error).message,
            },
          };
        }
      },
      providesTags: ["Results"],
    }),
    updateStudentResultByRollNumber: buildEndpoint.mutation<
      void,
      CreateOrUpdateResultPayload
    >({
      async queryFn(payload) {
        try {
          await updateResult(payload);
          return { data: undefined };
        } catch (error) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: (error as Error).message,
            },
          };
        }
      },
      invalidatesTags: ["Results", "Students"],
    }),
  }),
});

export const {
  useLoginStudentUsingRollNumberAndDateOfBirthMutation,
  useLoginAdminUsingEmailAndPasswordMutation,
  useGetAllStudentsFromFirestoreQuery,
  useGetSingleStudentByRollNumberQuery,
  useCreateSingleStudentRecordMutation,
  useUpdateSingleStudentRecordMutation,
  useCreateStudentResultAndUpdateStudentPostingFlagMutation,
  useGetStudentResultByRollNumberQuery,
  useUpdateStudentResultByRollNumberMutation,
} = portalApi;
