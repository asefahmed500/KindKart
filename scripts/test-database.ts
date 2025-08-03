import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function testDatabase() {
  console.log("🔍 Testing database connection and data...")

  try {
    // Test connection
    await prisma.$connect()
    console.log("✅ Database connection successful")

    // Test categories
    const categories = await prisma.category.findMany()
    console.log(`✅ Categories: ${categories.length} found`)

    if (categories.length === 0) {
      console.log("⚠️  No categories found - run 'npm run db:seed'")
    }

    // Test donation centers
    const centers = await prisma.donationCenter.findMany({
      include: {
        centerCategories: {
          include: {
            category: true,
          },
        },
      },
    })
    console.log(`✅ Donation Centers: ${centers.length} found`)

    if (centers.length === 0) {
      console.log("⚠️  No donation centers found - run 'npm run db:seed'")
    }

    // Test center-category relationships
    const relationships = await prisma.centerCategory.findMany()
    console.log(`✅ Center-Category relationships: ${relationships.length} found`)

    console.log("\n🎉 Database test completed successfully!")
    console.log("\nSample data:")
    console.log(
      "Categories:",
      categories
        .slice(0, 3)
        .map((c) => c.name)
        .join(", "),
    )
    console.log(
      "Centers:",
      centers
        .slice(0, 3)
        .map((c) => c.name)
        .join(", "),
    )
  } catch (error) {
    console.error("❌ Database test failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
