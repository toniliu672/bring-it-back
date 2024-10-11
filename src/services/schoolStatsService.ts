import { apiClient } from '@/utils/apiClient';
import { SchoolStatsResponse, Occupation } from '@/interfaces/schoolStats';
import { ApiResponse } from '@/interfaces/apiResponse';


export async function fetchSchoolStats(occupationCode: string): Promise<SchoolStatsResponse> {
  const response = await apiClient<null, ApiResponse<SchoolStatsResponse>>(
    `/schools/stats/by-occupation?occupationCode=${encodeURIComponent(occupationCode)}`,
    {
      method: 'GET',
    }
  );

  if (response && response.success && response.data) {
    return response.data;
  }

  throw new Error("Invalid response format from API");
}

export async function searchOccupations(query: string): Promise<Occupation[]> {
  const response = await apiClient<null, ApiResponse<Occupation[]>>(
    `/occupations/search?query=${encodeURIComponent(query)}`,
    {
      method: 'GET',
    }
  );

  if (response && response.success && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}
