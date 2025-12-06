/*
  Warnings:

  - You are about to drop the column `card_photo_url` on the `Student` table. All the data in the column will be lost.
  - Added the required column `card_photo_key` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "card_photo_url",
ADD COLUMN     "card_photo_key" VARCHAR NOT NULL;
