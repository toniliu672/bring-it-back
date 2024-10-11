import { NextRequest } from "next/server";
import { prisma, Prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { withAuth } from "@/utils/authUtils";
import { withCORS } from "@/utils/corsUtils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; competencyId: string } }
) {
  try {
    const { id: occupationId, competencyId } = params;
    const competency = await prisma.occupationCompetency.findFirst({
      where: {
        id: competencyId,
        occupationId,
      },
      include: {
        graduateCompetencies: true,
      },
    });

    if (!competency) {
      return errorResponse("Competency not found", 404);
    }

    return successResponse(competency);
  } catch (error) {
    console.error("Error fetching competency:", error);
    return errorResponse("Failed to fetch competency", 500);
  }
}

export const PUT = withCORS(
  withAuth(
    async (
      request: NextRequest,
      { params }: { params: { id: string; competencyId: string } }
    ) => {
      try {
        const { id: occupationId, competencyId } = params;
        const body = await request.json();
        const { unitCode, name, standardCompetency } = body;

        // Cek apakah unitCode sudah ada untuk okupasi ini (kecuali untuk kompetensi yang sedang diupdate)
        if (unitCode) {
          const existingCompetency =
            await prisma.occupationCompetency.findFirst({
              where: {
                occupationId,
                unitCode,
                NOT: {
                  id: competencyId,
                },
              },
            });

          if (existingCompetency) {
            return errorResponse(
              "Unit Code already exists for another competency in this occupation",
              400
            );
          }
        }

        const updatedCompetency = await prisma.occupationCompetency.update({
          where: {
            id: competencyId,
            occupationId,
          },
          data: {
            unitCode,
            name,
            standardCompetency,
          },
        });

        return successResponse(updatedCompetency);
      } catch (error) {
        console.error("Error updating competency:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            return errorResponse("Competency not found", 404);
          }
        }
        return errorResponse("Failed to update competency", 500);
      }
    }
  )
);

export const DELETE = withCORS(
  withAuth(
    async (
      request: NextRequest,
      { params }: { params: { id: string; competencyId: string } }
    ) => {
      try {
        const { id: occupationId, competencyId } = params;

        await prisma.occupationCompetency.delete({
          where: {
            id: competencyId,
            occupationId,
          },
        });

        return successResponse({ message: "Competency deleted successfully" });
      } catch (error) {
        console.error("Error deleting competency:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            return errorResponse("Competency not found", 404);
          }
        }
        return errorResponse("Failed to delete competency", 500);
      }
    }
  )
);
