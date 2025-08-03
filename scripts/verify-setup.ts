import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function verifySetup() {
  console.log("🔍 Verifying KindKart database setup...")

  try {
    await prisma.$connect()
    console.log("✅ Database connection successful")

    // Check categories
    const categories = await prisma.category.findMany()
    console.log(`✅ Categories found: ${categories.length}`)

    if (categories.length > 0) {
      console.log(
        "   Sample categories:",
        categories
          .slice(0, 3)
          .map((c) => c.name)
          .join(", "),
      )
    }

    // Check donation centers
    const centers = await prisma.donationCenter.findMany({
      include: {
        centerCategories: {
          include: {
            category: true,
          },
        },
      },
    })
    console.log(`✅ Donation centers found: ${centers.length}`)

    if (centers.length > 0) {
      console.log(
        "   Sample centers:",
        centers
          .slice(0, 3)
          .map((c) => c.name)
          .join(", "),
      )
    }

    // Check relationships
    const relationships = await prisma.centerCategory.findMany()
    console.log(`✅ Center-category relationships: ${relationships.length}`)

    // Test API endpoints
    console.log("\n🌐 Testing API endpoints...")

    try {
      const categoriesResponse = await fetch("http://localhost:3000/api/categories")
      if (categoriesResponse.ok) {
        console.log("✅ Categories API working")
      } else {
        console.log("⚠️  Categories API not responding (app may not be running)")
      }
    } catch {
      console.log("⚠️  API test skipped (app not running)")
    }

    console.log("\n🎉 Database verification complete!")
    console.log("\nNext steps:")
    console.log("1. Run 'npm run dev' to start the application")
    console.log("2. Open http://localhost:3000")
    console.log("3. Search for 'San Francisco, CA' to test")
  } catch (error) {
    console.error("❌ Verification failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

verifySetup()
