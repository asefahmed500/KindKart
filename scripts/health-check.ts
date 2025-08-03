import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function quickHealthCheck() {
  console.log("🏥 KindKart Health Check")
  console.log("=".repeat(30))

  try {
    // Database connection
    await prisma.$connect()
    console.log("✅ Database: Connected")

    // Data availability
    const categoriesCount = await prisma.category.count()
    const centersCount = await prisma.donationCenter.count()

    console.log(`✅ Categories: ${categoriesCount} available`)
    console.log(`✅ Centers: ${centersCount} available`)

    // Sample query performance
    const start = Date.now()
    await prisma.donationCenter.findMany({
      take: 10,
      include: {
        centerCategories: {
          include: {
            category: true,
          },
        },
      },
    })
    const queryTime = Date.now() - start

    console.log(`✅ Query Performance: ${queryTime}ms`)

    if (queryTime < 1000) {
      console.log("🎉 System Status: HEALTHY")
    } else {
      console.log("⚠️ System Status: SLOW")
    }
  } catch (error) {
    console.log("❌ System Status: ERROR")
    console.error("Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

quickHealthCheck()
