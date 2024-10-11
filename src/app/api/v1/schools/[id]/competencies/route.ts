import { NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { withAuth } from "@/utils/authUtils";
import { withCORS } from "@/utils/corsUtils";

// GET: Mengambil semua kompetensi untuk sekolah tertentu
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const competencies = await prisma.graduateCompetency.findMany({
      where: { schoolId: id },
      include: {
        competency: true,
      },
    });

    // Ensure we're returning an array
    return successResponse(competencies);
  } catch (error) {
    console.error("Error fetching school competencies:", error);
    return errorResponse("Failed to fetch school competencies", 500);
  }
}
// POST: Menambahkan kompetensi baru ke sekolah
export const POST = withCORS(withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      const body = await request.json();
      const { competencyId } = body;

      const newCompetency = await prisma.graduateCompetency.create({
        data: {
          schoolId: id,
          competencyId: competencyId,
        },
        include: {
          competency: true,
        },
      });

      return successResponse(newCompetency, 201);
    } catch (error) {
      console.error("Error adding school competency:", error);
      return errorResponse("Failed to add school competency", 500);
    }
  }
));

// DELETE: Menghapus kompetensi dari sekolah
export const DELETE = withCORS(withAuth(
  async (request: NextRequest, { params }: { params: { id: string } }) => {
    try {
      const { id } = params;
      const competencyId = request.nextUrl.searchParams.get("competencyId");

      if (!competencyId) {
        return errorResponse("Competency ID is required", 400);
      }

      await prisma.graduateCompetency.delete({
        where: {
          schoolId_competencyId: {
            schoolId: id,
            competencyId: competencyId,
          },
        },
      });

      return successResponse({
        message: "School competency deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting school competency:", error);
      return errorResponse("Failed to delete school competency", 500);
    }
  }
));
