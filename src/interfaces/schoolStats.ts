// src/interfaces/schoolStats.ts

export interface Competency {
    id: string;
    occupationId: string;
    unitCode?: string;
    name: string;
    standardCompetency?: string;
  }
  
  export interface GraduateCompetency {
    schoolId: string;
    competencyId: string;
    competency: Competency;
  }
  
  export interface ConcentrationDetail {
    id: string;
    name: string;
  }
  
  export interface SchoolConcentrationDetail {
    schoolId: string;
    concentrationId: string;
    concentration: ConcentrationDetail;
  }
  
  export interface School {
    id: string;
    name: string;
    city: string;
    address: string;
    description?: string;
    studentCount: number;
    graduateCount: number;
    externalLinks: string[];
    competencies: GraduateCompetency[];
    concentrations: SchoolConcentrationDetail[];
    matchingCompetencies: number;
    totalCompetencies: number;
    percentage: number;
  }
  
  export interface SchoolStatsResponse {
    occupationCode: string;
    occupationName: string;
    schools: School[];
  }
  
  export interface Occupation {
    id: string;
    code: string;
    name: string;
  }
  
  export interface OccupationSearchResponse {
    occupations: Occupation[];
  }