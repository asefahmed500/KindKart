import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // Using OpenCage Geocoder API (free tier: 2,500 requests/day)
    const apiKey = process.env.OPENCAGE_API_KEY

    if (!apiKey) {
      // Enhanced fallback geocoding for demo purposes
      const mockCoordinates: Record<string, { lat: number; lng: number; formatted_address: string }> = {
        // Major cities
        "san francisco": { lat: 37.7749, lng: -122.4194, formatted_address: "San Francisco, CA, USA" },
        "new york": { lat: 40.7128, lng: -74.006, formatted_address: "New York, NY, USA" },
        "los angeles": { lat: 34.0522, lng: -118.2437, formatted_address: "Los Angeles, CA, USA" },
        chicago: { lat: 41.8781, lng: -87.6298, formatted_address: "Chicago, IL, USA" },
        houston: { lat: 29.7604, lng: -95.3698, formatted_address: "Houston, TX, USA" },
        phoenix: { lat: 33.4484, lng: -112.074, formatted_address: "Phoenix, AZ, USA" },
        philadelphia: { lat: 39.9526, lng: -75.1652, formatted_address: "Philadelphia, PA, USA" },
        "san antonio": { lat: 29.4241, lng: -98.4936, formatted_address: "San Antonio, TX, USA" },
        "san diego": { lat: 32.7157, lng: -117.1611, formatted_address: "San Diego, CA, USA" },
        dallas: { lat: 32.7767, lng: -96.797, formatted_address: "Dallas, TX, USA" },
        austin: { lat: 30.2672, lng: -97.7431, formatted_address: "Austin, TX, USA" },
        seattle: { lat: 47.6062, lng: -122.3321, formatted_address: "Seattle, WA, USA" },
        denver: { lat: 39.7392, lng: -104.9903, formatted_address: "Denver, CO, USA" },
        boston: { lat: 42.3601, lng: -71.0589, formatted_address: "Boston, MA, USA" },
        miami: { lat: 25.7617, lng: -80.1918, formatted_address: "Miami, FL, USA" },
        atlanta: { lat: 33.749, lng: -84.388, formatted_address: "Atlanta, GA, USA" },
        oakland: { lat: 37.8044, lng: -122.2711, formatted_address: "Oakland, CA, USA" },
        berkeley: { lat: 37.8715, lng: -122.273, formatted_address: "Berkeley, CA, USA" },
        "san jose": { lat: 37.3382, lng: -121.8863, formatted_address: "San Jose, CA, USA" },

        // ZIP codes
        "90210": { lat: 34.0901, lng: -118.4065, formatted_address: "Beverly Hills, CA 90210, USA" },
        "10001": { lat: 40.7505, lng: -73.9934, formatted_address: "New York, NY 10001, USA" },
        "60601": { lat: 41.8827, lng: -87.6233, formatted_address: "Chicago, IL 60601, USA" },
        "94102": { lat: 37.7749, lng: -122.4194, formatted_address: "San Francisco, CA 94102, USA" },
        "77001": { lat: 29.7604, lng: -95.3698, formatted_address: "Houston, TX 77001, USA" },
        "85001": { lat: 33.4484, lng: -112.074, formatted_address: "Phoenix, AZ 85001, USA" },
        "19101": { lat: 39.9526, lng: -75.1652, formatted_address: "Philadelphia, PA 19101, USA" },
        "78201": { lat: 29.4241, lng: -98.4936, formatted_address: "San Antonio, TX 78201, USA" },
        "92101": { lat: 32.7157, lng: -117.1611, formatted_address: "San Diego, CA 92101, USA" },
        "75201": { lat: 32.7767, lng: -96.797, formatted_address: "Dallas, TX 75201, USA" },
        "94103": { lat: 37.7849, lng: -122.4094, formatted_address: "San Francisco, CA 94103, USA" },
        "94104": { lat: 37.7949, lng: -122.3994, formatted_address: "San Francisco, CA 94104, USA" },
        "94601": { lat: 37.8044, lng: -122.2711, formatted_address: "Oakland, CA 94601, USA" },
        "94702": { lat: 37.8715, lng: -122.273, formatted_address: "Berkeley, CA 94702, USA" },
        "95110": { lat: 37.3382, lng: -121.8863, formatted_address: "San Jose, CA 95110, USA" },
      }

      const normalizedAddress = address.toLowerCase().trim()

      // Try exact match first
      if (mockCoordinates[normalizedAddress]) {
        return NextResponse.json(mockCoordinates[normalizedAddress])
      }

      // Try partial matches
      for (const [key, coords] of Object.entries(mockCoordinates)) {
        if (normalizedAddress.includes(key) || key.includes(normalizedAddress)) {
          return NextResponse.json(coords)
        }
      }

      // Default to San Francisco if no match found
      return NextResponse.json({
        lat: 37.7749,
        lng: -122.4194,
        formatted_address: `${address} (using San Francisco as fallback)`,
      })
    }

    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}&limit=1&no_annotations=1`,
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      return NextResponse.json({
        lat: result.geometry.lat,
        lng: result.geometry.lng,
        formatted_address: result.formatted,
      })
    } else {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Geocoding error:", error)
    return NextResponse.json({ error: "Geocoding failed" }, { status: 500 })
  }
}
