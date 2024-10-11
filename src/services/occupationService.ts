import { apiClient } from "@/utils/apiClient";
import {
  Occupation,
  GetOccupationsParams,
  GetOccupationsResponse,
  CreateOccupationData,
  UpdateOccupationData,
} from "@/interfaces/occupation";
import { ApiResponse } from "@/interfaces/apiResponse";


export async function getOccupations(
  params: GetOccupationsParams
): Promise<GetOccupationsResponse> {
  try {
    const queryParams = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    const response = await apiClient<
      undefined,
      ApiResponse<GetOccupationsResponse>
    >(`/occupations?${queryParams}`);

    console.log("API Response:", response);

    if (!response || !response.success || !response.data) {
      throw new Error("Invalid response format");
    }

    const { occupations, meta } = response.data;

    if (!Array.isArray(occupations) || !meta) {
      throw new Error("Invalid data structure");
    }

    return {
      occupations,
      meta: {
        currentPage: meta.currentPage,
        totalPages: meta.totalPages,
        totalCount: meta.totalCount,
        limit: meta.limit,
      },
    };
  } catch (error) {
    console.error("Error in getOccupations:", error);
    throw error;
  }
}

export async function createOccupation(
  data: CreateOccupationData
): Promise<Occupation> {
  const response = await apiClient<
    CreateOccupationData,
    ApiResponse<Occupation>
  >("/occupations", {
    method: "POST",
    body: data,
  });

  if (!response.success || !response.data) {
    throw new Error("Failed to create occupation");
  }

  return response.data;
}

export async function getOccupation(id: string): Promise<Occupation> {
  const response = await apiClient<undefined, ApiResponse<Occupation>>(
    `/occupations/${id}`
  );
  console.log("API Response for getOccupation:", response);

  if (!response || !response.success || !response.data) {
    throw new Error("Invalid response format");
  }

  return response.data;
}

export async function getOccupationByName(name: string): Promise<Occupation> {
  const response = await apiClient<undefined, ApiResponse<Occupation>>(
    `/occupations/by-name/${encodeURIComponent(name)}`
  );

  if (!response || !response.success || !response.data) {
    throw new Error("Invalid response format");
  }

  return response.data;
}

export async function updateOccupation(
  id: string,
  data: UpdateOccupationData
): Promise<Occupation> {
  console.log(
    "Sending update request for occupation ID:",
    id,
    "with data:",
    data
  );
  const response = await apiClient<
    UpdateOccupationData,
    ApiResponse<Occupation>
  >(`/occupations/${id}`, {
    method: "PUT",
    body: data,
  });

  if (!response.success || !response.data) {
    throw new Error("Failed to update occupation");
  }

  return response.data;
}

export async function deleteOccupation(id: string): Promise<void> {
  const response = await apiClient<undefined, ApiResponse<void>>(
    `/occupations/${id}`,
    { method: "DELETE" }
  );

  if (!response.success) {
    throw new Error("Failed to delete occupation");
  }
}
