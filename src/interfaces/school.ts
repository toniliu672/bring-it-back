import { OccupationCompetency } from "./occupation";

export interface School {
  id: string;
  name: string;
  city: string;
  address: string;
  description?: string;
  studentCount: number;
  graduateCount: number;
  externalLinks: string[];
  competencies?: GraduateCompetency[];
  concentrations?: SchoolConcentration[];
}

export interface GraduateCompetency {
  id: string;
  name: string;
}

export interface SchoolConcentration {
  id: string;
  name: string;
}

export interface GetSchoolsParams {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  sortBy?: "name" | "city";
  sortOrder?: "asc" | "desc";
}

export interface GetSchoolsResponse {
  schools: School[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export interface CreateSchoolData {
  name: string;
  city: string;
  address: string;
  description?: string;
  studentCount: number;
  graduateCount: number;
  externalLinks: string[];
  competencies?: { id: string }[];
  concentrations?: { id: string }[];
}

export interface UpdateSchoolData {
  name?: string;
  city?: string;
  address?: string;
  description?: string;
  studentCount?: number;
  graduateCount?: number;
  externalLinks?: string[];
  competencies?: { id: string }[];
  concentrations?: { id: string }[];
}

export interface GraduateCompetency {
  schoolId: string;
  competencyId: string;
  competency: {
    id: string;
    occupationId: string;
    unitCode: string;
    name: string;
    standardCompetency: string;
  };
}
