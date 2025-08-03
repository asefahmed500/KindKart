const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

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

  console.log('Creating categories...')
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
      acceptedItems: ["Non-perishable food", "Canned goods", "Fresh produce"],
      organizationType: "Food Bank",
      description: "Serving the San Francisco community with fresh food and groceries for families in need.",
      categories: ["Food Banks"]
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
      acceptedItems: ["Clothing", "Shoes", "Household items", "Electronics"],
      organizationType: "Thrift Store",
      description: "Accepting gently used clothing, household items, and electronics to support job training programs.",
      categories: ["Clothing Donations"]
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
      acceptedItems: ["Blankets", "Warm clothing", "Personal hygiene items", "Non-perishable food"],
      organizationType: "Homeless Shelter",
      description: "Providing shelter, meals, and support services for individuals experiencing homelessness.",
      categories: ["Homeless Shelters"]
    },
    {
      name: "Bay Area Medical Supply Donations",
      address: "321 Health Street",
      city: "Oakland",
      state: "CA",
      zipCode: "94601",
      latitude: 37.8044,
      longitude: -122.2711,
      phone: "(510) 555-0321",
      email: "donations@bayareamedical.org",
      website: "https://bayareamedical.org",
      hoursOfOperation: {
        monday: "9:00 AM - 4:00 PM",
        tuesday: "9:00 AM - 4:00 PM",
        wednesday: "9:00 AM - 4:00 PM",
        thursday: "9:00 AM - 4:00 PM",
        friday: "9:00 AM - 4:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      },
      acceptedItems: ["Medical equipment", "Wheelchairs", "Crutches", "First aid supplies"],
      organizationType: "Medical Supply Center",
      description: "Collecting and redistributing medical supplies and equipment to those in need.",
      categories: ["Medical Supplies"]
    },
    {
      name: "Berkeley Electronics Recycling",
      address: "654 Tech Avenue",
      city: "Berkeley",
      state: "CA",
      zipCode: "94702",
      latitude: 37.8715,
      longitude: -122.273,
      phone: "(510) 555-0654",
      email: "recycle@berkeleytech.org",
      website: "https://berkeleytech.org",
      hoursOfOperation: {
        monday: "10:00 AM - 6:00 PM",
        tuesday: "10:00 AM - 6:00 PM",
        wednesday: "10:00 AM - 6:00 PM",
        thursday: "10:00 AM - 6:00 PM",
        friday: "10:00 AM - 6:00 PM",
        saturday: "10:00 AM - 4:00 PM",
        sunday: "Closed",
      },
      acceptedItems: ["Computers", "Phones", "Tablets", "Cables", "Batteries"],
      organizationType: "Recycling Center",
      description: "Responsibly recycling electronics and refurbishing devices for community use.",
      categories: ["Electronics Recycling"]
    },
    {
      name: "San Jose Book Exchange",
      address: "987 Library Lane",
      city: "San Jose",
      state: "CA",
      zipCode: "95110",
      latitude: 37.3382,
      longitude: -121.8863,
      phone: "(408) 555-0987",
      email: "books@sjbookexchange.org",
      website: "https://sjbookexchange.org",
      hoursOfOperation: {
        monday: "11:00 AM - 7:00 PM",
        tuesday: "11:00 AM - 7:00 PM",
        wednesday: "11:00 AM - 7:00 PM",
        thursday: "11:00 AM - 7:00 PM",
        friday: "11:00 AM - 7:00 PM",
        saturday: "10:00 AM - 5:00 PM",
        sunday: "12:00 PM - 5:00 PM",
      },
      acceptedItems: ["Books", "Magazines", "Educational materials", "DVDs"],
      organizationType: "Book Exchange",
      description: "Collecting books and educational materials to support literacy programs in the community.",
      categories: ["Book Donations"]
    }
  ]

  console.log('Creating donation centers...')
  for (const center of donationCenters) {
    const { categories: centerCategories, ...centerData } = center
    
    const createdCenter = await prisma.donationCenter.upsert({
      where: { 
        name: center.name 
      },
      update: {},
      create: centerData,
    })

    // Link categories to centers
    for (const categoryName of centerCategories) {
      const category = await prisma.category.findUnique({
        where: { name: categoryName }
      })
      
      if (category) {
        await prisma.centerCategory.upsert({
          where: {
            centerId_categoryId: {
              centerId: createdCenter.id,
              categoryId: category.id
            }
          },
          update: {},
          create: {
            centerId: createdCenter.id,
            categoryId: category.id
          }
        })
      }
    }
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })