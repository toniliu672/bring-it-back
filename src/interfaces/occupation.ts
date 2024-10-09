// src/interfaces/occupation.ts

// Kita tetap mengimpor tipe Prisma untuk referensi
import { Prisma } from '@prisma/client';

export interface Occupation {
  id: string;
  code: string;
  name: string;
  competencies?: OccupationCompetency[];
}

// Pastikan interface OccupationCompetency sudah ada
export interface OccupationCompetency {
  id: string;
  occupationId: string;
  unitCode: string | null;
  name: string;
  standardCompetency: string | null;
}

export interface GetOccupationsParams {
  page?: number;
  limit?: number;
  searchCode?: string;
  searchName?: string;
  sortBy?: 'code' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface GetOccupationsResponse {
  occupations: Occupation[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

// Buat interface yang sesuai dengan kebutuhan API kita
export interface CreateOccupationData {
  code: string;
  name: string;
  competencies?: {
    unitCode?: string;
    name: string;
    standardCompetency?: string;
  }[];
}

export interface UpdateOccupationData {
  code?: string;
  name?: string;
  competencies?: {
    id?: string; // untuk update existing competency
    unitCode?: string;
    name?: string;
    standardCompetency?: string;
  }[];
}