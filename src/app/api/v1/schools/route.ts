import { NextRequest } from 'next/server';
import { prisma } from '@/config/prisma';
import { Prisma } from '@prisma/client';
import { successResponse, errorResponse } from '@/utils/apiResponse';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;
  
    const skip = (page - 1) * limit;
  
    try {
      const where: Prisma.SchoolWhereInput = search
        ? {
            OR: [
              { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { city: { contains: search, mode: Prisma.QueryMode.insensitive } },
              { description: { contains: search, mode: Prisma.QueryMode.insensitive } },
            ],
          }
        : {};
  
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
          orderBy: {
            name: 'asc',
          },
        }),
        prisma.school.count({ where }),
      ]);
  
      const schoolsWithGraduatePercent = schools.map(school => ({
        ...school,
        graduatePercent: school.studentCount > 0
          ? (school.graduateCount / school.studentCount) * 100
          : 0
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
      console.error('Error fetching schools:', error);
      return errorResponse('Failed to fetch schools', 500);
    }
  }
  
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json();
      const { name, city, address, description, studentCount, graduateCount, externalLinks, competencies, concentrations } = body;
  
      const newSchool = await prisma.school.create({
        data: {
          name,
          city,
          address,
          description,
          studentCount,
          graduateCount,
          externalLinks,
          competencies: {
            create: competencies?.map((comp: any) => ({
              competency: {
                connect: { id: comp.id }
              }
            }))
          },
          concentrations: {
            create: concentrations?.map((conc: any) => ({
              concentration: {
                connect: { id: conc.id }
              }
            }))
          }
        },
        include: {
          competencies: {
            include: {
              competency: true
            }
          },
          concentrations: {
            include: {
              concentration: true
            }
          }
        }
      });
  
      const schoolWithGraduatePercent = {
        ...newSchool,
        graduatePercent: newSchool.studentCount > 0
          ? (newSchool.graduateCount / newSchool.studentCount) * 100
          : 0
      };
  
      return successResponse(schoolWithGraduatePercent, 201);
    } catch (error) {
      console.error('Error creating school:', error);
      return errorResponse('Failed to create school', 500);
    }
  }