import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)

    // Fallback categories if database fails
    const fallbackCategories = [
      { id: 1, name: "Food Banks", icon: "🍞", color: "#FF6B6B" },
      { id: 2, name: "Clothing Donations", icon: "👕", color: "#4ECDC4" },
      { id: 3, name: "Homeless Shelters", icon: "🏠", color: "#45B7D1" },
      { id: 4, name: "Medical Supplies", icon: "🏥", color: "#96CEB4" },
      { id: 5, name: "Electronics Recycling", icon: "💻", color: "#FFEAA7" },
      { id: 6, name: "Book Donations", icon: "📚", color: "#DDA0DD" },
      { id: 7, name: "Toy Donations", icon: "🧸", color: "#FFB6C1" },
      { id: 8, name: "Animal Shelters", icon: "🐕", color: "#98D8C8" },
    ]

    return NextResponse.json(fallbackCategories)
  }
}
