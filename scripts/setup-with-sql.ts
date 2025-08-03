import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

async function runSqlFile(filename: string) {
  console.log(`📄 Running ${filename}...`)
  try {
    const sqlPath = join(process.cwd(), "scripts", filename)
    const sql = readFileSync(sqlPath, "utf-8")

    // Split by semicolon and filter out empty statements
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"))

    for (const statement of statements) {
      if (statement.trim()) {
        await prisma.$executeRawUnsafe(statement)
      }
    }

    console.log(`✅ ${filename} completed successfully`)
  } catch (error) {
    console.error(`❌ Error running ${filename}:`, error)
    throw error
  }
}

async function setupDatabase() {
  console.log("🚀 Setting up KindKart database with SQL files...")

  try {
    // Test connection
    await prisma.$connect()
    console.log("✅ Database connection successful")

    // Run SQL files in order
    await runSqlFile("001-create-tables.sql")
    await runSqlFile("002-seed-categories.sql")
    await runSqlFile("003-seed-donation-centers.sql")

    // Verify data
    const categoriesCount = await prisma.category.count()
    const centersCount = await prisma.donationCenter.count()
    const relationshipsCount = await prisma.centerCategory.count()

    console.log("\n📊 Database Setup Complete!")
    console.log(`✅ Categories: ${categoriesCount}`)
    console.log(`✅ Donation Centers: ${centersCount}`)
    console.log(`✅ Center-Category Relationships: ${relationshipsCount}`)

    if (categoriesCount === 0 || centersCount === 0) {
      throw new Error("Data was not inserted properly")
    }

    console.log("\n🎉 KindKart database is ready!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
