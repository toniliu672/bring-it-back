import { NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { withAuth } from "@/utils/authUtils";
import { withCORS } from "@/utils/corsUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: occupationId } = params;
    const competencies = await prisma.occupationCompetency.findMany({
      where: { occupationId },
      include: {
        graduateCompetencies: true,
      },
    });
    return successResponse(competencies);
  } catch (error) {
    console.error("Error fetching competencies:", error);
    return errorResponse("Failed to fetch competencies", 500);
  }
}

export const POST = withCORS(
  withAuth(
    async (request: NextRequest, { params }: { params: { id: string } }) => {
      try {
        const { id: occupationId } = params;
        const body = await request.json();
        const { unitCode, name, standardCompetency } = body;

        // Cek apakah unitCode sudah ada untuk okupasi ini
        const existingCompetency = await prisma.occupationCompetency.findFirst({
          where: {
            occupationId,
            unitCode,
          },
        });

        if (existingCompetency) {
          return errorResponse(
            "Unit Code already exists for this occupation",
            400
          );
        }

        const newCompetency = await prisma.occupationCompetency.create({
          data: {
            occupationId,
            unitCode,
            name,
            standardCompetency,
          },
        });

        return successResponse(newCompetency, 201);
      } catch (error) {
        console.error("Error creating competency:", error);
        return errorResponse("Failed to create competency", 500);
      }
    }
  )
);
