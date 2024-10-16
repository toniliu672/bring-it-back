import { apiClient } from "@/utils/apiClient";
import {
  School,
  GetSchoolsParams,
  GetSchoolsResponse,
  CreateSchoolData,
  UpdateSchoolData,
  GraduateCompetency,
} from "@/interfaces/school";
import { ApiResponse } from "@/interfaces/apiResponse";

export async function getSchools(
  params: GetSchoolsParams
): Promise<GetSchoolsResponse> {
  try {
    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    const response = await apiClient<undefined, ApiResponse<GetSchoolsResponse>>(
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
  const response = await apiClient<CreateSchoolData, ApiResponse<School>>(
    "/schools",
    {
      method: "POST",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error("Failed to create school");
  }

  return response.data;
}

export async function getSchool(id: string): Promise<School> {
  const response = await apiClient<undefined, ApiResponse<School>>(`/schools/${id}`);
  
  if (!response || !response.success || !response.data) {
    throw new Error("Invalid response format");
  }

  return response.data;
}

export async function updateSchool(
  id: string,
  data: UpdateSchoolData
): Promise<School> {
  const response = await apiClient<UpdateSchoolData, ApiResponse<School>>(
    `/schools/${id}`,
    {
      method: "PUT",
      body: data,
    }
  );

  if (!response.success || !response.data) {
    throw new Error("Failed to update school");
  }

  return response.data;
}

export async function deleteSchool(id: string): Promise<void> {
  const response = await apiClient<undefined, ApiResponse<void>>(
    `/schools/${id}`,
    { method: "DELETE" }
  );

  if (!response.success) {
    throw new Error("Failed to delete school");
  }
}

export async function getSchoolCompetencies(schoolId: string): Promise<GraduateCompetency[]> {
  console.log("Fetching school competencies for school ID:", schoolId);
  const response = await apiClient<undefined, ApiResponse<GraduateCompetency[]>>(
    `/schools/${schoolId}/competencies`
  );

  console.log("Raw API response:", response);

  if (response && response.success && Array.isArray(response.data)) {
    console.log("Processed school competencies:", response.data);
    return response.data;
  }

  console.log("Returning empty array due to invalid response");
  return [];
}

export async function addSchoolCompetency(schoolId: string, competencyId: string): Promise<GraduateCompetency> {
  const response = await apiClient<{ competencyId: string }, ApiResponse<GraduateCompetency>>(
    `/schools/${schoolId}/competencies`,
    {
      method: "POST",
      body: { competencyId },
    }
  );

  if (!response.success || !response.data) {
    throw new Error("Failed to add school competency");
  }

  return response.data;
}

export async function removeSchoolCompetency(schoolId: string, competencyId: string): Promise<void> {
  const response = await apiClient<undefined, ApiResponse<void>>(
    `/schools/${schoolId}/competencies?competencyId=${competencyId}`,
    {
      method: "DELETE",
    }
  );

  if (!response.success) {
    throw new Error("Failed to remove school competency");
  }
}
