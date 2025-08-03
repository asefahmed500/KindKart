import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = Number.parseFloat(searchParams.get("lat") || "0")
    const lng = Number.parseFloat(searchParams.get("lng") || "0")
    const radius = Number.parseFloat(searchParams.get("radius") || "25")
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    if (!lat || !lng) {
      return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
    }

    try {
      // Build the where clause for filtering
      const whereClause: Prisma.DonationCenterWhereInput = {
        isActive: true,
      }

      // Add category filter if specified
      if (category && category !== "all") {
        whereClause.centerCategories = {
          some: {
            category: {
              name: category,
            },
          },
        }
      }

      // Fetch centers from database
      const centers = await prisma.donationCenter.findMany({
        where: whereClause,
        include: {
          centerCategories: {
            include: {
              category: true,
            },
          },
        },
        take: limit * 2, // Get more than needed to account for distance filtering
      })

      // Calculate distances and filter by radius
      const centersWithDistance = centers
        .map((center) => ({
          ...center,
          distance: calculateDistance(lat, lng, Number(center.latitude), Number(center.longitude)),
          categories: center.centerCategories.map((cc) => ({
            name: cc.category.name,
            icon: cc.category.icon,
            color: cc.category.color,
          })),
        }))
        .filter((center) => center.distance <= radius)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)

      // Transform the data to match the expected format
      const transformedCenters = centersWithDistance.map((center) => ({
        id: center.id,
        name: center.name,
        address: center.address,
        city: center.city,
        state: center.state,
        zip_code: center.zipCode,
        latitude: Number(center.latitude),
        longitude: Number(center.longitude),
        phone: center.phone,
        email: center.email,
        website: center.website,
        hours_of_operation: center.hoursOfOperation as Record<string, string> | null,
        accepted_items: center.acceptedItems,
        organization_type: center.organizationType,
        description: center.description,
        special_instructions: center.specialInstructions,
        distance: center.distance,
        categories: center.categories,
      }))

      return NextResponse.json(transformedCenters)
    } catch (dbError) {
      console.error("Database error, using fallback:", dbError)

      // Fallback centers if database fails
      const fallbackCenters = [
        {
          id: 1,
          name: "Central Food Bank",
          address: "123 Main Street",
          city: "San Francisco",
          state: "CA",
          zip_code: "94102",
          latitude: 37.7749,
          longitude: -122.4194,
          phone: "(415) 555-0123",
          email: "info@centralfoodbank.org",
          website: "https://centralfoodbank.org",
          hours_of_operation: {
            monday: "9:00 AM - 5:00 PM",
            tuesday: "9:00 AM - 5:00 PM",
            wednesday: "9:00 AM - 5:00 PM",
            thursday: "9:00 AM - 5:00 PM",
            friday: "9:00 AM - 5:00 PM",
            saturday: "10:00 AM - 2:00 PM",
            sunday: "Closed",
          },
          accepted_items: ["Non-perishable food", "Canned goods", "Fresh produce"],
          organization_type: "Food Bank",
          description: "Serving the San Francisco community with fresh food and groceries for families in need.",
          categories: [{ name: "Food Banks", icon: "🍞", color: "#FF6B6B" }],
        },
        {
          id: 2,
          name: "Goodwill Donation Center",
          address: "456 Oak Avenue",
          city: "San Francisco",
          state: "CA",
          zip_code: "94103",
          latitude: 37.7849,
          longitude: -122.4094,
          phone: "(415) 555-0456",
          email: "donations@goodwillsf.org",
          website: "https://goodwillsf.org",
          hours_of_operation: {
            monday: "8:00 AM - 8:00 PM",
            tuesday: "8:00 AM - 8:00 PM",
            wednesday: "8:00 AM - 8:00 PM",
            thursday: "8:00 AM - 8:00 PM",
            friday: "8:00 AM - 8:00 PM",
            saturday: "8:00 AM - 6:00 PM",
            sunday: "10:00 AM - 6:00 PM",
          },
          accepted_items: ["Clothing", "Shoes", "Household items", "Electronics"],
          organization_type: "Thrift Store",
          description:
            "Accepting gently used clothing, household items, and electronics to support job training programs.",
          categories: [{ name: "Clothing Donations", icon: "👕", color: "#4ECDC4" }],
        },
        {
          id: 3,
          name: "St. Mary's Homeless Shelter",
          address: "789 Pine Street",
          city: "San Francisco",
          state: "CA",
          zip_code: "94104",
          latitude: 37.7949,
          longitude: -122.3994,
          phone: "(415) 555-0789",
          email: "help@stmarysshelter.org",
          website: "https://stmarysshelter.org",
          hours_of_operation: {
            monday: "24 hours",
            tuesday: "24 hours",
            wednesday: "24 hours",
            thursday: "24 hours",
            friday: "24 hours",
            saturday: "24 hours",
            sunday: "24 hours",
          },
          accepted_items: ["Blankets", "Warm clothing", "Personal hygiene items", "Non-perishable food"],
          organization_type: "Homeless Shelter",
          description: "Providing shelter, meals, and support services for individuals experiencing homelessness.",
          categories: [{ name: "Homeless Shelters", icon: "🏠", color: "#45B7D1" }],
        },
      ]

      // Filter and calculate distances for fallback centers
      const centersWithDistance = fallbackCenters
        .map((center) => ({
          ...center,
          distance: calculateDistance(lat, lng, center.latitude, center.longitude),
        }))
        .filter((center) => center.distance <= radius)
        .filter((center) => {
          if (!category || category === "all") return true
          return center.categories?.some((cat: any) => cat.name === category)
        })
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit)

      return NextResponse.json(centersWithDistance)
    }
  } catch (error) {
    console.error("Error fetching centers:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch centers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
