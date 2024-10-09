// src/interfaces/school.ts

export interface School {
    id: string;
    name: string;
    city: string;
    address: string;
    description?: string;
    studentCount: number;
    graduateCount: number;
    externalLinks: string[];
    competencies?: any[]; // Sesuaikan dengan struktur kompetensi yang sebenarnya
    concentrations?: any[]; // Sesuaikan dengan struktur konsentrasi yang sebenarnya
  }
  
  export interface GetSchoolsParams {
    page?: number;
    limit?: number;
    searchName?: string;
    searchCity?: string;
    sortBy?: 'name' | 'city';
    sortOrder?: 'asc' | 'desc';
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
  }
  
  export interface UpdateSchoolData {
    name?: string;
    city?: string;
    address?: string;
    description?: string;
  }