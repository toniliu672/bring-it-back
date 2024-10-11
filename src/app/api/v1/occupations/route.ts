import { NextRequest } from "next/server";
import { prisma, Prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { withAuth } from "@/utils/authUtils";
import { withCORS } from "@/utils/corsUtils";
import { CompetencyInput } from "@/interfaces/occupation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const searchCode = searchParams.get("searchCode") || "";
    const searchName = searchParams.get("searchName") || "";
    const sortBy = (searchParams.get("sortBy") as "code" | "name") || "code";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

    const where: Prisma.OccupationWhereInput = {
      ...(searchCode && {
        code: { contains: searchCode, mode: "insensitive" },
      }),
      ...(searchName && {
        name: { contains: searchName, mode: "insensitive" },
      }),
    };

    const [occupations, totalCount] = await Promise.all([
      prisma.occupation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { competencies: true },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.occupation.count({ where }),
    ]);

    return successResponse({
      occupations,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching occupations:", error);
    return errorResponse("Failed to fetch occupations", 500);
  }
}

export const POST = withCORS(
  withAuth(async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { code, name, competencies } = body;

      // Check if the code already exists
      const existingOccupation = await prisma.occupation.findUnique({
        where: { code },
      });

      if (existingOccupation) {
        return errorResponse("Occupation code already exists", 400);
      }

      const newOccupation = await prisma.occupation.create({
        data: {
          code,
          name,
          competencies: {
            create: competencies?.map((comp: CompetencyInput) => ({
              unitCode: comp.unitCode,
              name: comp.name,
              standardCompetency: comp.standardCompetency,
            })),
          },
        },
        include: {
          competencies: true,
        },
      });

      return successResponse(newOccupation, 201);
    } catch (error) {
      console.error("Error creating occupation:", error);
      return errorResponse("Failed to create occupation", 500);
    }
  })
);
