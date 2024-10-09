import { apiClient } from "@/utils/apiClient";
import { OccupationCompetency } from "@/interfaces/occupation";

export async function getCompetencies(occupationId: string): Promise<OccupationCompetency[]> {
  const response = await apiClient<undefined, { data: OccupationCompetency[] }>(`/occupations/${occupationId}/competencies`);
  return response.data;
}

export async function getCompetency(occupationId: string, competencyId: string): Promise<OccupationCompetency> {
  const response = await apiClient<undefined, { data: OccupationCompetency }>(`/occupations/${occupationId}/competencies/${competencyId}`);
  return response.data;
}

export async function createCompetency(occupationId: string, competencyData: Partial<OccupationCompetency>): Promise<OccupationCompetency> {
  const response = await apiClient<Partial<OccupationCompetency>, { data: OccupationCompetency }>(`/occupations/${occupationId}/competencies`, {
    method: "POST",
    body: competencyData,
  });
  return response.data;
}

export async function updateCompetency(occupationId: string, competencyId: string, competencyData: Partial<OccupationCompetency>): Promise<OccupationCompetency> {
  const response = await apiClient<Partial<OccupationCompetency>, { data: OccupationCompetency }>(`/occupations/${occupationId}/competencies/${competencyId}`, {
    method: "PUT",
    body: competencyData,
  });
  return response.data;
}

export async function deleteCompetency(occupationId: string, competencyId: string): Promise<void> {
  await apiClient<undefined, void>(`/occupations/${occupationId}/competencies/${competencyId}`, {
    method: "DELETE",
  });
}