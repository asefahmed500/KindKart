import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid center ID" }, { status: 400 })
    }

    const center = await prisma.donationCenter.findUnique({
      where: {
        id: id,
        isActive: true,
      },
      include: {
        centerCategories: {
          include: {
            category: true,
          },
        },
      },
    })

    if (!center) {
      return NextResponse.json({ error: "Center not found" }, { status: 404 })
    }

    // Transform the data to match the expected format
    const transformedCenter = {
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
      categories: center.centerCategories.map((cc) => ({
        name: cc.category.name,
        icon: cc.category.icon,
        color: cc.category.color,
      })),
    }

    return NextResponse.json(transformedCenter)
  } catch (error) {
    console.error("Error fetching center:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch center",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
