// src/services/schoolService.ts

import { apiClient } from "@/utils/apiClient";
import {
  School,
  GetSchoolsParams,
  GetSchoolsResponse,
  CreateSchoolData,
  UpdateSchoolData,
} from "@/interfaces/school";

export async function getSchools(
  params: GetSchoolsParams
): Promise<GetSchoolsResponse> {
  try {
    const queryParams = new URLSearchParams(params as any).toString();
    const response = await apiClient<undefined, any>(
      `/schools?${queryParams}`
    );

    if (!response || !response.success || !response.data) {
      throw new Error("Invalid response format");
    }

    const { schools, meta } = response.data;

    if (!Array.isArray(schools) || !meta) {
      throw new Error("Invalid data structure");
    }

    return {
      schools,
      meta: {
        currentPage: meta.currentPage,
        totalPages: meta.totalPages,
        totalCount: meta.totalCount,
        limit: meta.limit,
      },
    };
  } catch (error) {
    console.error("Error in getSchools:", error);
    throw error;
  }
}

export async function createSchool(
  data: CreateSchoolData
): Promise<School> {
  return apiClient<CreateSchoolData, School>("/schools", {
    method: "POST",
    body: data,
  });
}

export async function getSchool(id: string): Promise<School> {
  return apiClient<undefined, School>(`/schools/${id}`);
}

export async function updateSchool(
  id: string,
  data: UpdateSchoolData
): Promise<School> {
  return apiClient<UpdateSchoolData, School>(`/schools/${id}`, {
    method: "PUT",
    body: data,
  });
}

export async function deleteSchool(id: string): Promise<void> {
  return apiClient<undefined, void>(`/schools/${id}`, { method: "DELETE" });
}