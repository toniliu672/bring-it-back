// src/app/api/v1/schools/stats/by-occupation/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const occupationCode = searchParams.get("occupationCode");

    if (!occupationCode) {
      return errorResponse("Occupation code is required", 400);
    }

    // Langkah 1: Dapatkan okupasi berdasarkan kode
    const occupation = await prisma.occupation.findUnique({
      where: { code: occupationCode },
      include: { competencies: true },
    });

    if (!occupation) {
      return errorResponse("Occupation not found", 404);
    }

    // Langkah 2: Dapatkan semua sekolah dengan kompetensi dari okupasi ini
    const schools = await prisma.school.findMany({
      include: {
        competencies: {
          include: {
            competency: true,
          },
        },
        concentrations: { // Jika Anda juga ingin menyertakan konsentrasi
          include: {
            concentration: true,
          },
        },
      },
    });

    // Langkah 3: Hitung persentase untuk setiap sekolah
    const schoolStats = schools.map((school) => {
      const totalCompetencies = occupation.competencies.length;
      const matchingCompetencies = school.competencies.filter((gc) =>
        occupation.competencies.some((oc) => oc.id === gc.competencyId)
      ).length;

      const percentage = (matchingCompetencies / totalCompetencies) * 100;

      return {
        ...school, // Menyertakan semua properti dari objek school
        matchingCompetencies,
        totalCompetencies,
        percentage: Number(percentage.toFixed(2)),
      };
    });

    // Urutkan sekolah berdasarkan persentase tertinggi
    schoolStats.sort((a, b) => b.percentage - a.percentage);

    return successResponse({
      occupationCode: occupation.code,
      occupationName: occupation.name,
      schools: schoolStats,
    });
  } catch (error) {
    console.error("Error fetching school stats:", error);
    return errorResponse("Failed to fetch school stats", 500);
  }
}
