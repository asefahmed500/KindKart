import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Create categories
  const categories = [
    { name: "Food Banks", icon: "🍞", color: "#FF6B6B" },
    { name: "Clothing Donations", icon: "👕", color: "#4ECDC4" },
    { name: "Homeless Shelters", icon: "🏠", color: "#45B7D1" },
    { name: "Medical Supplies", icon: "🏥", color: "#96CEB4" },
    { name: "Electronics Recycling", icon: "💻", color: "#FFEAA7" },
    { name: "Book Donations", icon: "📚", color: "#DDA0DD" },
    { name: "Toy Donations", icon: "🧸", color: "#FFB6C1" },
    { name: "Animal Shelters", icon: "🐕", color: "#98D8C8" },
  ]

  console.log("📂 Creating categories...")
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  // Create donation centers
  const donationCenters = [
    {
      name: "Central Food Bank",
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      latitude: 37.7749,
      longitude: -122.4194,
      phone: "(415) 555-0123",
      email: "info@centralfoodbank.org",
      website: "https://centralfoodbank.org",
      hoursOfOperation: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "10:00 AM - 2:00 PM",
        sunday: "Closed",
      },
      acceptedItems: ["Non-perishable food", "Canned goods", "Fresh produce", "Baby formula"],
      organizationType: "Food Bank",
      description: "Serving the San Francisco community with fresh food and groceries for families in need.",
      specialInstructions: "Please bring donations during operating hours. Large donations require advance notice.",
      categories: ["Food Banks"],
    },
    {
      name: "Goodwill Donation Center",
      address: "456 Oak Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      latitude: 37.7849,
      longitude: -122.4094,
      phone: "(415) 555-0456",
      email: "donations@goodwillsf.org",
      website: "https://goodwillsf.org",
      hoursOfOperation: {
        monday: "8:00 AM - 8:00 PM",
        tuesday: "8:00 AM - 8:00 PM",
        wednesday: "8:00 AM - 8:00 PM",
        thursday: "8:00 AM - 8:00 PM",
        friday: "8:00 AM - 8:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "10:00 AM - 6:00 PM",
      },
      acceptedItems: ["Clothing", "Shoes", "Household items", "Electronics", "Books", "Furniture"],
      organizationType: "Thrift Store",
      description: "Accepting gently used clothing, household items, and electronics to support job training programs.",
      specialInstructions: "Items must be clean and in good condition. No broken electronics or stained clothing.",
      categories: ["Clothing Donations", "Electronics Recycling"],
    },
    {
      name: "St. Mary's Homeless Shelter",
      address: "789 Pine Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94104",
      latitude: 37.7949,
      longitude: -122.3994,
      phone: "(415) 555-0789",
      email: "help@stmarysshelter.org",
      website: "https://stmarysshelter.org",
      hoursOfOperation: {
        monday: "24 hours",
        tuesday: "24 hours",
        wednesday: "24 hours",
        thursday: "24 hours",
        friday: "24 hours",
        saturday: "24 hours",
        sunday: "24 hours",
      },
      acceptedItems: [
        "Blankets",
        "Warm clothing",
        "Personal hygiene items",
        "Non-perishable food",
        "Socks",
        "Underwear",
      ],
      organizationType: "Homeless Shelter",
      description: "Providing shelter, meals, and support services for individuals experiencing homelessness.",
      specialInstructions: "New items preferred for hygiene products. Donations accepted at front desk.",
      categories: ["Homeless Shelters", "Clothing Donations"],
    },
    {
      name: "Bay Area Animal Rescue",
      address: "321 Elm Street",
      city: "Oakland",
      state: "CA",
      zipCode: "94601",
      latitude: 37.8044,
      longitude: -122.2711,
      phone: "(510) 555-0321",
      email: "info@bayarearescue.org",
      website: "https://bayarearescue.org",
      hoursOfOperation: {
        monday: "10:00 AM - 6:00 PM",
        tuesday: "10:00 AM - 6:00 PM",
        wednesday: "10:00 AM - 6:00 PM",
        thursday: "10:00 AM - 6:00 PM",
        friday: "10:00 AM - 6:00 PM",
        saturday: "9:00 AM - 5:00 PM",
        sunday: "12:00 PM - 4:00 PM",
      },
      acceptedItems: ["Pet food", "Pet toys", "Blankets", "Pet carriers", "Leashes", "Pet beds"],
      organizationType: "Animal Shelter",
      description: "Rescuing and caring for abandoned animals while finding them loving homes.",
      specialInstructions: "Please check expiration dates on pet food. Call ahead for large donations.",
      categories: ["Animal Shelters"],
    },
    {
      name: "Books for All Library",
      address: "654 Cedar Lane",
      city: "Berkeley",
      state: "CA",
      zipCode: "94702",
      latitude: 37.8715,
      longitude: -122.273,
      phone: "(510) 555-0654",
      email: "donations@booksforall.org",
      website: "https://booksforall.org",
      hoursOfOperation: {
        monday: "9:00 AM - 7:00 PM",
        tuesday: "9:00 AM - 7:00 PM",
        wednesday: "9:00 AM - 7:00 PM",
        thursday: "9:00 AM - 7:00 PM",
        friday: "9:00 AM - 7:00 PM",
        saturday: "10:00 AM - 5:00 PM",
        sunday: "1:00 PM - 5:00 PM",
      },
      acceptedItems: ["Books", "Magazines", "Educational materials", "DVDs", "Audio books"],
      organizationType: "Library",
      description:
        "Collecting books and educational materials to support literacy programs in underserved communities.",
      specialInstructions: "Books should be in good condition. Textbooks from the last 5 years preferred.",
      categories: ["Book Donations"],
    },
    {
      name: "Community Medical Clinic",
      address: "987 Health Way",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      latitude: 37.7849,
      longitude: -122.4094,
      phone: "(415) 555-0987",
      email: "supplies@communitymedical.org",
      website: "https://communitymedical.org",
      hoursOfOperation: {
        monday: "8:00 AM - 6:00 PM",
        tuesday: "8:00 AM - 6:00 PM",
        wednesday: "8:00 AM - 6:00 PM",
        thursday: "8:00 AM - 6:00 PM",
        friday: "8:00 AM - 6:00 PM",
        saturday: "9:00 AM - 1:00 PM",
        sunday: "Closed",
      },
      acceptedItems: [
        "First aid supplies",
        "Bandages",
        "Over-the-counter medications",
        "Medical equipment",
        "Wheelchairs",
      ],
      organizationType: "Medical Clinic",
      description: "Providing free medical care and accepting medical supply donations for underserved populations.",
      specialInstructions: "All medical supplies must be unopened and unexpired. Call to verify needed items.",
      categories: ["Medical Supplies"],
    },
    {
      name: "Happy Kids Toy Drive",
      address: "456 Playground Ave",
      city: "San Francisco",
      state: "CA",
      zipCode: "94107",
      latitude: 37.7649,
      longitude: -122.4094,
      phone: "(415) 555-0456",
      email: "toys@happykids.org",
      website: "https://happykids.org",
      hoursOfOperation: {
        monday: "10:00 AM - 4:00 PM",
        tuesday: "10:00 AM - 4:00 PM",
        wednesday: "10:00 AM - 4:00 PM",
        thursday: "10:00 AM - 4:00 PM",
        friday: "10:00 AM - 4:00 PM",
        saturday: "9:00 AM - 3:00 PM",
        sunday: "Closed",
      },
      acceptedItems: ["New toys", "Board games", "Educational toys", "Art supplies", "Sports equipment"],
      organizationType: "Non-profit",
      description:
        "Collecting new toys and games to distribute to children in need during holidays and throughout the year.",
      specialInstructions: "Only new, unwrapped toys accepted. No stuffed animals or toys with small parts for safety.",
      categories: ["Toy Donations"],
    },
    {
      name: "Tech Recycle Center",
      address: "789 Innovation Blvd",
      city: "San Jose",
      state: "CA",
      zipCode: "95110",
      latitude: 37.3382,
      longitude: -121.8863,
      phone: "(408) 555-0789",
      email: "recycle@techcenter.org",
      website: "https://techrecycle.org",
      hoursOfOperation: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "10:00 AM - 2:00 PM",
        sunday: "Closed",
      },
      acceptedItems: ["Computers", "Phones", "Tablets", "Cables", "Printers", "Monitors"],
      organizationType: "Recycling Center",
      description: "Responsibly recycling electronic devices and refurbishing computers for low-income families.",
      specialInstructions: "Please remove all personal data before donation. We provide data wiping services.",
      categories: ["Electronics Recycling"],
    },
  ]

  console.log("🏢 Creating donation centers...")
  for (const centerData of donationCenters) {
    const { categories: categoryNames, ...centerInfo } = centerData

    const center = await prisma.donationCenter.upsert({
      where: {
        name: centerInfo.name,
      },
      update: {},
      create: {
        ...centerInfo,
        latitude: centerInfo.latitude,
        longitude: centerInfo.longitude,
      },
    })

    // Link categories
    for (const categoryName of categoryNames) {
      const category = await prisma.category.findUnique({
        where: { name: categoryName },
      })

      if (category) {
        await prisma.centerCategory.upsert({
          where: {
            centerId_categoryId: {
              centerId: center.id,
              categoryId: category.id,
            },
          },
          update: {},
          create: {
            centerId: center.id,
            categoryId: category.id,
          },
        })
      }
    }
  }

  console.log("✅ Database seeded successfully!")
  console.log(`📊 Created ${categories.length} categories and ${donationCenters.length} donation centers`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
