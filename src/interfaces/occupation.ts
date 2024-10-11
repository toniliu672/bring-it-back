// src/interfaces/occupation.ts
export interface Occupation {
  id: string;
  code: string;
  name: string;
  competencies?: OccupationCompetency[];
}

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
  searchQuery?: string; // Tambahkan baris ini
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

// Tambahkan interface ini untuk menangani input kompetensi
export interface CompetencyInput {
  unitCode: string;
  name: string;
  standardCompetency: string;
  [key: string]: string; // Ini menambahkan index signature
}

export interface CreateOccupationData {
  code: string;
  name: string;
  competencies: CompetencyInput[];
}

export interface UpdateOccupationData {
  code?: string;
  name?: string;
  competencies?: (CompetencyInput & { id?: string })[];
}