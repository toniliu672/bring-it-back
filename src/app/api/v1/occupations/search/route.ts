import { NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return errorResponse("Search query is required", 400);
    }

    const occupations = await prisma.occupation.findMany({
      where: {
        OR: [
          { code: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
      take: 10,
    });

    return successResponse(occupations);
  } catch (error) {
    console.error("Error searching occupations:", error);
    return errorResponse("Failed to search occupations", 500);
  }
}