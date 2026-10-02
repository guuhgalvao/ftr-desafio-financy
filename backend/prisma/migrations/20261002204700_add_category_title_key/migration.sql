-- Adds Category.titleKey (title lowercased and without accents) and moves the per-user unique
-- index from title to titleKey.
-- Existing rows are backfilled with lower(title): SQLite cannot strip accents, so their key is
-- only fully normalized once the category is saved again (or the database is reset).
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "titleKey" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("color", "createdAt", "description", "icon", "id", "title", "titleKey", "updatedAt", "userId") SELECT "color", "createdAt", "description", "icon", "id", "title", lower(trim("title")), "updatedAt", "userId" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_userId_titleKey_key" ON "Category"("userId", "titleKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
