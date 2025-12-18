-- Add role USER to enum
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'USER';

-- Add active column with default
ALTER TABLE "User"
ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- Add updatedAt with safe default
ALTER TABLE "User"
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW();
