-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetPasswordExp" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;
