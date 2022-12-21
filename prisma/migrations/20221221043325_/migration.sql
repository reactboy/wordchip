/*
  Warnings:

  - You are about to drop the column `titls` on the `Word` table. All the data in the column will be lost.
  - Added the required column `title` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Word" ("createdAt", "createdBy", "description", "id", "updatedAt", "updatedBy", "userId") SELECT "createdAt", "createdBy", "description", "id", "updatedAt", "updatedBy", "userId" FROM "Word";
DROP TABLE "Word";
ALTER TABLE "new_Word" RENAME TO "Word";
CREATE UNIQUE INDEX "Word_userId_key" ON "Word"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
