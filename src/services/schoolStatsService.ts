import { apiClient } from '@/utils/apiClient';
import { SchoolStatsResponse, Occupation } from '@/interfaces/schoolStats';

export async function fetchSchoolStats(occupationCode: string): Promise<SchoolStatsResponse> {
  const response = await apiClient<null, any>(
    `/schools/stats/by-occupation?occupationCode=${encodeURIComponent(occupationCode)}`,
    {
      method: 'GET',
    }
  );

  if (response && response.data) {
    return response.data;
  }

  throw new Error("Invalid response format from API");
}

export async function searchOccupations(query: string): Promise<Occupation[]> {
  const response = await apiClient<null, any>(
    `/occupations/search?query=${encodeURIComponent(query)}`,
    {
      method: 'GET',
    }
  );

  if (response && response.data && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}