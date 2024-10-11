import { NextRequest } from "next/server";
import { prisma, Prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { withAuth } from "@/utils/authUtils";
import { withCORS } from "@/utils/corsUtils";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    console.log("Fetching occupation with ID:", id);

    if (!id || typeof id !== "string") {
      return errorResponse("Invalid occupation ID", 400);
    }

    const occupation = await prisma.occupation.findUnique({
      where: { id },
      include: {
        competencies: true,
      },
    });

    if (!occupation) {
      return errorResponse("Occupation not found", 404);
    }

    return successResponse(occupation);
  } catch (error) {
    console.error("Error fetching occupation:", error);
    return errorResponse("Failed to fetch occupation", 500);
  }
}

export const PUT = withCORS(
  withAuth(
    async (request: NextRequest, { params }: { params: { id: string } }) => {
      try {
        const { id } = params;
        console.log("Received update request for occupation ID:", id);

        // Baca body request sekali dan simpan dalam variabel
        const body = await request.json();
        console.log("Request body:", body);

        const { code, name, competencies } = body;

        // Check if the occupation exists
        const existingOccupation = await prisma.occupation.findUnique({
          where: { id },
        });

        if (!existingOccupation) {
          return errorResponse("Occupation not found", 404);
        }

        // Check if the new code already exists for another occupation
        if (code && code !== existingOccupation.code) {
          const occupationWithCode = await prisma.occupation.findUnique({
            where: { code },
          });

          if (occupationWithCode && occupationWithCode.id !== id) {
            return errorResponse("Occupation code already in use", 400);
          }
        }

        const updatedOccupation = await prisma.occupation.update({
          where: { id },
          data: {
            code,
            name,
            competencies: {
              deleteMany: {}, // Delete existing competencies
              create: competencies?.map((comp: any) => ({
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

        return successResponse(updatedOccupation);
      } catch (error) {
        console.error("Error updating occupation:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            return errorResponse("Occupation not found", 404);
          }
        }
        return errorResponse("Failed to update occupation", 500);
      }
    }
  )
);

export const DELETE = withCORS(
  withAuth(
    async (request: NextRequest, { params }: { params: { id: string } }) => {
      try {
        const { id } = params;
        console.log("Deleting occupation with ID:", id);

        if (!id || typeof id !== "string") {
          return errorResponse("Invalid occupation ID", 400);
        }

        await prisma.occupation.delete({
          where: { id },
        });

        return successResponse({ message: "Occupation deleted successfully" });
      } catch (error) {
        console.error("Error deleting occupation:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            return errorResponse("Occupation not found", 404);
          }
        }
        return errorResponse("Failed to delete occupation", 500);
      }
    }
  )
);
