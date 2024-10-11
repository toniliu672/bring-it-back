import { NextRequest, NextResponse } from "next/server";
import { prisma, Prisma } from "@/config/prisma";
import { successResponse, errorResponse } from "@/utils/apiResponse";
import { withAuth } from "@/utils/authUtils";
import { checkAccess, withCORS } from "@/utils/corsUtils";

export const GET = withCORS(async (request: NextRequest) => {
  // if (!checkAccess(request)) {
  //   return errorResponse("Unauthorized access", 403);
  // }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const city = searchParams.get("city") || undefined;

  const skip = (page - 1) * limit;

  try {
    const where: Prisma.SchoolWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        city ? { city: { equals: city, mode: "insensitive" } } : {},
      ],
    };

    const [schools, totalCount] = await Promise.all([
      prisma.school.findMany({
        where,
        skip,
        take: limit,
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
        orderBy: [
          {
            name: "asc",
          },
        ],
      }),
      prisma.school.count({ where }),
    ]);

    const sortedSchools = schools.sort((a, b) => {
      if (a.name.toLowerCase() === search.toLowerCase()) return -1;
      if (b.name.toLowerCase() === search.toLowerCase()) return 1;
      return a.name.localeCompare(b.name);
    });

    const schoolsWithGraduatePercent = sortedSchools.map((school) => ({
      ...school,
      graduatePercent:
        school.studentCount > 0
          ? (school.graduateCount / school.studentCount) * 100
          : 0,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return successResponse({
      schools: schoolsWithGraduatePercent,
      meta: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching schools:", error);
    return errorResponse("Failed to fetch schools", 500);
  }
});

export const POST = withCORS(
  withAuth(async (request: NextRequest) => {
    try {
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

      // Validasi input
      if (!name || !city || !address) {
        return errorResponse("Name, city, and address are required", 400);
      }

      const newSchool = await prisma.school.create({
        data: {
          name,
          city,
          address,
          description: description || "",
          studentCount: studentCount || 0,
          graduateCount: graduateCount || 0,
          externalLinks: externalLinks || [],
          competencies: {
            create: competencies?.map((comp: { id: string }) => ({
              competency: {
                connect: { id: comp.id },
              },
            })),
          },
          concentrations: {
            create: concentrations?.map((conc: { id: string }) => ({
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
        ...newSchool,
        graduatePercent:
          newSchool.studentCount > 0
            ? (newSchool.graduateCount / newSchool.studentCount) * 100
            : 0,
      };

      return successResponse(schoolWithGraduatePercent, 201);
    } catch (error) {
      console.error("Error creating school:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return errorResponse("A school with this name already exists", 400);
        }
      }
      return errorResponse("Failed to create school", 500);
    }
  })
);

// Tambahkan ini untuk menangani OPTIONS secara eksplisit
export const OPTIONS = withCORS(async () => {
  return new NextResponse(null, { status: 204 });
});
