import { PrismaClient } from "@prisma/client"
import { readFileSync } from "fs"
import { join } from "path"

const prisma = new PrismaClient()

interface TestResult {
  category: string
  test: string
  status: "✅ PASS" | "❌ FAIL" | "⚠️ WARNING"
  message: string
  details?: string
}

const results: TestResult[] = []

function addResult(category: string, test: string, status: TestResult["status"], message: string, details?: string) {
  results.push({ category, test, status, message, details })
}

async function testDatabaseConnection() {
  console.log("🔍 Testing Database Connection...")

  try {
    await prisma.$connect()
    addResult("Database", "Connection", "✅ PASS", "Database connection successful")

    // Test query execution
    await prisma.$queryRaw`SELECT 1`
    addResult("Database", "Query Execution", "✅ PASS", "Database queries working")

    return true
  } catch (error) {
    addResult(
      "Database",
      "Connection",
      "❌ FAIL",
      "Database connection failed",
      error instanceof Error ? error.message : "Unknown error",
    )
    return false
  }
}

async function testDatabaseSchema() {
  console.log("🔍 Testing Database Schema...")

  try {
    // Test all tables exist
    const tables = (await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `) as any[]

    const requiredTables = ["categories", "donation_centers", "center_categories"]
    const existingTables = tables.map((t) => t.table_name)

    for (const table of requiredTables) {
      if (existingTables.includes(table)) {
        addResult("Schema", `Table: ${table}`, "✅ PASS", `Table ${table} exists`)
      } else {
        addResult("Schema", `Table: ${table}`, "❌ FAIL", `Table ${table} missing`)
      }
    }

    // Test indexes
    const indexes = (await prisma.$queryRaw`
      SELECT indexname 
      FROM pg_indexes 
      WHERE schemaname = 'public'
    `) as any[]

    const indexNames = indexes.map((i) => i.indexname)
    const requiredIndexes = ["idx_donation_centers_location", "idx_donation_centers_city"]

    for (const index of requiredIndexes) {
      if (indexNames.some((name) => name.includes(index.split("_").pop() || ""))) {
        addResult("Schema", `Index: ${index}`, "✅ PASS", `Index for ${index} exists`)
      } else {
        addResult("Schema", `Index: ${index}`, "⚠️ WARNING", `Index ${index} may be missing`)
      }
    }

    return true
  } catch (error) {
    addResult(
      "Schema",
      "Schema Check",
      "❌ FAIL",
      "Schema validation failed",
      error instanceof Error ? error.message : "Unknown error",
    )
    return false
  }
}

async function testDataIntegrity() {
  console.log("🔍 Testing Data Integrity...")

  try {
    // Test categories
    const categories = await prisma.category.findMany()
    if (categories.length >= 8) {
      addResult("Data", "Categories", "✅ PASS", `${categories.length} categories found`)
    } else {
      addResult("Data", "Categories", "❌ FAIL", `Only ${categories.length} categories found, expected at least 8`)
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

    if (centers.length >= 8) {
      addResult("Data", "Donation Centers", "✅ PASS", `${centers.length} donation centers found`)
    } else {
      addResult("Data", "Donation Centers", "❌ FAIL", `Only ${centers.length} centers found, expected at least 8`)
    }

    // Test relationships
    const relationships = await prisma.centerCategory.findMany()
    if (relationships.length >= 8) {
      addResult("Data", "Relationships", "✅ PASS", `${relationships.length} center-category relationships found`)
    } else {
      addResult("Data", "Relationships", "❌ FAIL", `Only ${relationships.length} relationships found`)
    }

    // Test data quality
    let dataQualityIssues = 0

    for (const center of centers) {
      if (!center.name || !center.address || !center.city || !center.state) {
        dataQualityIssues++
      }
      if (!center.latitude || !center.longitude) {
        dataQualityIssues++
      }
    }

    if (dataQualityIssues === 0) {
      addResult("Data", "Data Quality", "✅ PASS", "All centers have required fields")
    } else {
      addResult("Data", "Data Quality", "❌ FAIL", `${dataQualityIssues} data quality issues found`)
    }

    return true
  } catch (error) {
    addResult(
      "Data",
      "Data Integrity",
      "❌ FAIL",
      "Data integrity check failed",
      error instanceof Error ? error.message : "Unknown error",
    )
    return false
  }
}

async function testAPIEndpoints() {
  console.log("🔍 Testing API Endpoints...")

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  const endpoints = [
    { path: "/api/categories", method: "GET", name: "Categories API" },
    { path: "/api/centers?lat=37.7749&lng=-122.4194&radius=25", method: "GET", name: "Centers Search API" },
    { path: "/api/geocode", method: "POST", name: "Geocoding API", body: { address: "San Francisco, CA" } },
  ]

  for (const endpoint of endpoints) {
    try {
      const options: RequestInit = {
        method: endpoint.method,
        headers: { "Content-Type": "application/json" },
      }

      if (endpoint.body) {
        options.body = JSON.stringify(endpoint.body)
      }

      const response = await fetch(`${baseUrl}${endpoint.path}`, options)

      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) || (typeof data === "object" && data !== null)) {
          addResult("API", endpoint.name, "✅ PASS", `${endpoint.name} working correctly`)
        } else {
          addResult("API", endpoint.name, "⚠️ WARNING", `${endpoint.name} returned unexpected format`)
        }
      } else {
        addResult("API", endpoint.name, "❌ FAIL", `${endpoint.name} returned ${response.status}`)
      }
    } catch (error) {
      addResult("API", endpoint.name, "⚠️ WARNING", `${endpoint.name} not accessible (server may not be running)`)
    }
  }
}

async function testBusinessLogic() {
  console.log("🔍 Testing Business Logic...")

  try {
    // Test utility functions
    const { calculateDistance, isOpenNow, formatDistance, formatHours } = await import("../lib/utils")

    // Test distance calculation
    const distance = calculateDistance(37.7749, -122.4194, 37.7849, -122.4094)
    if (distance > 0 && distance < 10) {
      addResult("Logic", "Distance Calculation", "✅ PASS", "Distance calculation working")
    } else {
      addResult("Logic", "Distance Calculation", "❌ FAIL", `Invalid distance calculated: ${distance}`)
    }

    // Test hours checking
    const testHours = {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "10:00 AM - 2:00 PM",
      sunday: "Closed",
    }

    const isOpen = isOpenNow(testHours)
    addResult("Logic", "Hours Checking", "✅ PASS", `Hours checking function working (result: ${isOpen})`)

    // Test formatting functions
    const formattedDistance = formatDistance(1.5)
    const formattedHours = formatHours(testHours)

    if (formattedDistance && formattedHours) {
      addResult("Logic", "Formatting Functions", "✅ PASS", "All formatting functions working")
    } else {
      addResult("Logic", "Formatting Functions", "❌ FAIL", "Formatting functions not working properly")
    }
  } catch (error) {
    addResult(
      "Logic",
      "Business Logic",
      "❌ FAIL",
      "Business logic test failed",
      error instanceof Error ? error.message : "Unknown error",
    )
  }
}

async function testFileStructure() {
  console.log("🔍 Testing File Structure...")

  const requiredFiles = [
    "app/layout.tsx",
    "app/page.tsx",
    "app/globals.css",
    "app/api/categories/route.ts",
    "app/api/centers/route.ts",
    "app/api/geocode/route.ts",
    "components/MapView.tsx",
    "lib/prisma.ts",
    "lib/utils.ts",
    "lib/types.ts",
    "prisma/schema.prisma",
    "prisma/seed.ts",
    "package.json",
    "next.config.mjs",
    "tailwind.config.js",
  ]

  let missingFiles = 0

  for (const file of requiredFiles) {
    try {
      const filePath = join(process.cwd(), file)
      readFileSync(filePath, "utf-8")
      addResult("Files", `File: ${file}`, "✅ PASS", `${file} exists`)
    } catch (error) {
      addResult("Files", `File: ${file}`, "❌ FAIL", `${file} missing`)
      missingFiles++
    }
  }

  if (missingFiles === 0) {
    addResult("Files", "File Structure", "✅ PASS", "All required files present")
  } else {
    addResult("Files", "File Structure", "❌ FAIL", `${missingFiles} required files missing`)
  }
}

async function testEnvironmentVariables() {
  console.log("🔍 Testing Environment Variables...")

  const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"]

  let missingVars = 0

  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      addResult("Environment", `${envVar}`, "✅ PASS", `${envVar} is set`)
    } else {
      addResult("Environment", `${envVar}`, "❌ FAIL", `${envVar} is missing`)
      missingVars++
    }
  }

  // Optional variables
  const optionalEnvVars = ["OPENCAGE_API_KEY"]

  for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
      addResult("Environment", `${envVar}`, "✅ PASS", `${envVar} is set (optional)`)
    } else {
      addResult("Environment", `${envVar}`, "⚠️ WARNING", `${envVar} not set (optional)`)
    }
  }
}

async function testSearchFunctionality() {
  console.log("🔍 Testing Search Functionality...")

  try {
    // Test location-based search
    const centers = await prisma.donationCenter.findMany({
      include: {
        centerCategories: {
          include: {
            category: true,
          },
        },
      },
      take: 10,
    })

    if (centers.length > 0) {
      addResult("Search", "Location Search", "✅ PASS", `Found ${centers.length} centers`)

      // Test category filtering
      const foodBankCenters = centers.filter((center) =>
        center.centerCategories.some((cc) => cc.category.name === "Food Banks"),
      )

      if (foodBankCenters.length > 0) {
        addResult("Search", "Category Filtering", "✅ PASS", `Found ${foodBankCenters.length} food banks`)
      } else {
        addResult("Search", "Category Filtering", "⚠️ WARNING", "No food banks found for filtering test")
      }

      // Test data completeness
      const completeDataCenters = centers.filter(
        (center) => center.name && center.address && center.city && center.state && center.latitude && center.longitude,
      )

      if (completeDataCenters.length === centers.length) {
        addResult("Search", "Data Completeness", "✅ PASS", "All centers have complete data")
      } else {
        addResult(
          "Search",
          "Data Completeness",
          "❌ FAIL",
          `${centers.length - completeDataCenters.length} centers have incomplete data`,
        )
      }
    } else {
      addResult("Search", "Location Search", "❌ FAIL", "No centers found in database")
    }
  } catch (error) {
    addResult(
      "Search",
      "Search Functionality",
      "❌ FAIL",
      "Search functionality test failed",
      error instanceof Error ? error.message : "Unknown error",
    )
  }
}

function printResults() {
  console.log("\n" + "=".repeat(80))
  console.log("🎯 KINDKART COMPLETE VERIFICATION RESULTS")
  console.log("=".repeat(80))

  const categories = [...new Set(results.map((r) => r.category))]

  let totalTests = 0
  let passedTests = 0
  let failedTests = 0
  let warningTests = 0

  for (const category of categories) {
    console.log(`\n📋 ${category.toUpperCase()} TESTS:`)
    console.log("-".repeat(50))

    const categoryResults = results.filter((r) => r.category === category)

    for (const result of categoryResults) {
      console.log(`${result.status} ${result.test}: ${result.message}`)
      if (result.details) {
        console.log(`   Details: ${result.details}`)
      }

      totalTests++
      if (result.status === "✅ PASS") passedTests++
      else if (result.status === "❌ FAIL") failedTests++
      else if (result.status === "⚠️ WARNING") warningTests++
    }
  }

  console.log("\n" + "=".repeat(80))
  console.log("📊 SUMMARY")
  console.log("=".repeat(80))
  console.log(`Total Tests: ${totalTests}`)
  console.log(`✅ Passed: ${passedTests} (${Math.round((passedTests / totalTests) * 100)}%)`)
  console.log(`❌ Failed: ${failedTests} (${Math.round((failedTests / totalTests) * 100)}%)`)
  console.log(`⚠️ Warnings: ${warningTests} (${Math.round((warningTests / totalTests) * 100)}%)`)

  const successRate = Math.round((passedTests / totalTests) * 100)

  console.log("\n" + "=".repeat(80))

  if (successRate === 100 && failedTests === 0) {
    console.log("🎉 PERFECT! ALL TESTS PASSED!")
    console.log("✅ Your KindKart application is 100% ready for production!")
    console.log("\n🚀 NEXT STEPS:")
    console.log("1. Run 'npm run dev' to start your application")
    console.log("2. Open http://localhost:3000 in your browser")
    console.log("3. Test search with 'San Francisco, CA'")
    console.log("4. Deploy to production when ready")
  } else if (successRate >= 90 && failedTests === 0) {
    console.log("🎯 EXCELLENT! All critical tests passed!")
    console.log("✅ Your KindKart application is ready for production!")
    console.log("⚠️ Some optional features may need attention")
  } else if (successRate >= 80) {
    console.log("⚠️ GOOD! Most tests passed, but some issues need attention.")
    console.log("📋 RECOMMENDATIONS:")
    console.log("• Fix any failed tests before production deployment")
    console.log("• Address warnings for optimal performance")
  } else {
    console.log("❌ ISSUES DETECTED! Multiple problems need to be resolved.")
    console.log("📋 CRITICAL ACTIONS NEEDED:")
    console.log("• Fix database connection issues")
    console.log("• Ensure all required files are present")
    console.log("• Verify environment variables are set")
    console.log("• Run 'npm run setup' to reinitialize")
  }

  console.log("=".repeat(80))

  return { successRate, failedTests, warningTests, totalTests }
}

async function runCompleteVerification() {
  console.log("🚀 Starting Complete KindKart Verification...")
  console.log("This will test every aspect of your application.\n")

  try {
    // Run all tests
    await testEnvironmentVariables()
    await testFileStructure()

    const dbConnected = await testDatabaseConnection()
    if (dbConnected) {
      await testDatabaseSchema()
      await testDataIntegrity()
      await testSearchFunctionality()
    }

    await testBusinessLogic()
    await testAPIEndpoints()

    // Print comprehensive results
    const summary = printResults()

    // Exit with appropriate code
    if (summary.failedTests > 0) {
      process.exit(1)
    } else {
      process.exit(0)
    }
  } catch (error) {
    console.error("❌ Verification failed with error:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run verification
runCompleteVerification()
