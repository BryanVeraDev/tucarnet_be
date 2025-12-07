-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('ACTIVO', 'INACTIVO');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVO';

-- AlterTable
ALTER TABLE "PhotoRequest" ADD COLUMN     "rejection_reason" TEXT;
