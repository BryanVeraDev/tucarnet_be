export interface NormalizedStudent {
  studentCode: string;
  name: string;
  lastName: string;
  email: string;
  career: string;
  semester: number | null;
  status: string;
}

export interface NormalizationError {
  error: string;
}

export type NormalizedStudentResult = NormalizedStudent | NormalizationError;