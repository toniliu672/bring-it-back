import { NextRequest } from "next/server";
import { prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { Prisma } from "@prisma/client";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const school = await prisma.school.findUnique({
      where: { id },
      include: {
        competencies: {
          include: {
            competency: true,
          },
        },
        concentrations: {
          include: {
            concentration: true,
          },
        },
      },
    });

    if (!school) {
      return errorResponse("School not found", 404);
    }

    const schoolWithGraduatePercent = {
      ...school,
      graduatePercent:
        school.studentCount > 0
          ? (school.graduateCount / school.studentCount) * 100
          : 0,
    };

    return successResponse(schoolWithGraduatePercent);
  } catch (error) {
    console.error("Error fetching school:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2023") {
        return errorResponse("Invalid ID format", 400);
      }
    }
    return errorResponse("Failed to fetch school", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      name,
      city,
      address,
      description,
      studentCount,
      graduateCount,
      externalLinks,
      competencies,
      concentrations,
    } = body;

    const updatedSchool = await prisma.school.update({
      where: { id },
      data: {
        name,
        city,
        address,
        description,
        studentCount,
        graduateCount,
        externalLinks,
        competencies: {
          deleteMany: {},
          create: competencies?.map((comp: any) => ({
            competency: {
              connect: { id: comp.id },
            },
          })),
        },
        concentrations: {
          deleteMany: {},
          create: concentrations?.map((conc: any) => ({
            concentration: {
              connect: { id: conc.id },
            },
          })),
        },
      },
      include: {
        competencies: {
          include: {
            competency: true,
          },
        },
        concentrations: {
          include: {
            concentration: true,
          },
        },
      },
    });

    const schoolWithGraduatePercent = {
      ...updatedSchool,
      graduatePercent:
        updatedSchool.studentCount > 0
          ? (updatedSchool.graduateCount / updatedSchool.studentCount) * 100
          : 0,
    };

    return successResponse(schoolWithGraduatePercent);
  } catch (error) {
    console.error("Error updating school:", error);
    return errorResponse("Failed to update school", 500);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.school.delete({
      where: { id },
    });

    return successResponse({ message: "School deleted successfully" });
  } catch (error) {
    console.error("Error deleting school:", error);
    return errorResponse("Failed to delete school", 500);
  }
}
