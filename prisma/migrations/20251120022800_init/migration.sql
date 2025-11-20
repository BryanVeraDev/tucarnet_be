-- CreateEnum
CREATE TYPE "StudentType" AS ENUM ('PREGRADO', 'POSGRADO');

-- CreateEnum
CREATE TYPE "StudentStatus" AS ENUM ('MATRICULADO', 'NO_ACTIVO');

-- CreateEnum
CREATE TYPE "BiometricStatus" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "PhotoRequestStatus" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "ValidationResult" AS ENUM ('APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SuperAdmin', 'ValidaTor');

-- CreateTable
CREATE TABLE "Student" (
    "student_id" VARCHAR NOT NULL,
    "firebase_id" VARCHAR,
    "student_code" VARCHAR,
    "card_photo_url" VARCHAR,
    "email" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "student_type" "StudentType" NOT NULL,
    "career" VARCHAR(120) NOT NULL,
    "status" "StudentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "BiometricProfile" (
    "biometric_id" VARCHAR NOT NULL,
    "student_id" VARCHAR NOT NULL,
    "status" "BiometricStatus" NOT NULL,
    "photo_url" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiometricProfile_pkey" PRIMARY KEY ("biometric_id")
);

-- CreateTable
CREATE TABLE "BiometricValidationLog" (
    "validation_id" VARCHAR NOT NULL,
    "biometric_id" VARCHAR NOT NULL,
    "similitarity" DECIMAL(65,30) NOT NULL,
    "result" "ValidationResult" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BiometricValidationLog_pkey" PRIMARY KEY ("validation_id")
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "admin_id" VARCHAR NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "role" "AdminRole" NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("admin_id")
);

-- CreateTable
CREATE TABLE "PhotoRequest" (
    "request_id" VARCHAR NOT NULL,
    "student_id" VARCHAR NOT NULL,
    "admin_id" VARCHAR,
    "status" "PhotoRequestStatus" NOT NULL,
    "new_photo_url" VARCHAR,
    "application_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response_date" TIMESTAMP(3),

    CONSTRAINT "PhotoRequest_pkey" PRIMARY KEY ("request_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_firebase_id_key" ON "Student"("firebase_id");

-- CreateIndex
CREATE UNIQUE INDEX "BiometricProfile_student_id_key" ON "BiometricProfile"("student_id");

-- AddForeignKey
ALTER TABLE "BiometricProfile" ADD CONSTRAINT "BiometricProfile_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BiometricValidationLog" ADD CONSTRAINT "BiometricValidationLog_biometric_id_fkey" FOREIGN KEY ("biometric_id") REFERENCES "BiometricProfile"("biometric_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoRequest" ADD CONSTRAINT "PhotoRequest_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "Student"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoRequest" ADD CONSTRAINT "PhotoRequest_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "AdminUser"("admin_id") ON DELETE SET NULL ON UPDATE CASCADE;
