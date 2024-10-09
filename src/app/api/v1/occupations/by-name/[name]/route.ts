import { NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;
    const occupation = await prisma.occupation.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      include: { competencies: true },
    });

    if (!occupation) {
      return errorResponse("Occupation not found", 404);
    }

    return successResponse(occupation);
  } catch (error) {
    console.error("Error fetching occupation by name:", error);
    return errorResponse("Failed to fetch occupation", 500);
  }
}