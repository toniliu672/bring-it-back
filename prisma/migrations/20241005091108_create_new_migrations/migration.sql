-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "studentCount" INTEGER NOT NULL DEFAULT 0,
    "graduateCount" INTEGER NOT NULL DEFAULT 0,
    "externalLinks" TEXT[],

    CONSTRAINT "schools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "occupations" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "occupations_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "occupation_competencies" (
    "id" TEXT NOT NULL,
    "occupationCode" TEXT NOT NULL,
    "unitCode" TEXT,
    "name" TEXT NOT NULL,
    "standardCompetency" VARCHAR(250) DEFAULT '',

    CONSTRAINT "occupation_competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graduate_competencies" (
    "schoolId" TEXT NOT NULL,
    "competencyId" TEXT NOT NULL,

    CONSTRAINT "graduate_competencies_pkey" PRIMARY KEY ("schoolId","competencyId")
);

-- CreateTable
CREATE TABLE "concentrations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "concentrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_concentrations" (
    "schoolId" TEXT NOT NULL,
    "concentrationId" TEXT NOT NULL,

    CONSTRAINT "school_concentrations_pkey" PRIMARY KEY ("schoolId","concentrationId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "schools_name_key" ON "schools"("name");

-- CreateIndex
CREATE UNIQUE INDEX "occupations_name_key" ON "occupations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "concentrations_name_key" ON "concentrations"("name");

-- AddForeignKey
ALTER TABLE "occupation_competencies" ADD CONSTRAINT "occupation_competencies_occupationCode_fkey" FOREIGN KEY ("occupationCode") REFERENCES "occupations"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduate_competencies" ADD CONSTRAINT "graduate_competencies_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduate_competencies" ADD CONSTRAINT "graduate_competencies_competencyId_fkey" FOREIGN KEY ("competencyId") REFERENCES "occupation_competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_concentrations" ADD CONSTRAINT "school_concentrations_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_concentrations" ADD CONSTRAINT "school_concentrations_concentrationId_fkey" FOREIGN KEY ("concentrationId") REFERENCES "concentrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
