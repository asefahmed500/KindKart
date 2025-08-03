"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Search, MapPin, List, Filter, Clock, Phone, Globe, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { isOpenNow, formatDistance, formatHours } from "@/lib/utils"
import type { DonationCenter } from "@/lib/types"

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>,
})

interface Category {
  id: number
  name: string
  icon: string
  color: string
}

// Fallback categories
const fallbackCategories: Category[] = [
  { id: 1, name: "Food Banks", icon: "🍞", color: "#FF6B6B" },
  { id: 2, name: "Clothing Donations", icon: "👕", color: "#4ECDC4" },
  { id: 3, name: "Homeless Shelters", icon: "🏠", color: "#45B7D1" },
  { id: 4, name: "Medical Supplies", icon: "🏥", color: "#96CEB4" },
  { id: 5, name: "Electronics Recycling", icon: "💻", color: "#FFEAA7" },
  { id: 6, name: "Book Donations", icon: "📚", color: "#DDA0DD" },
  { id: 7, name: "Toy Donations", icon: "🧸", color: "#FFB6C1" },
  { id: 8, name: "Animal Shelters", icon: "🐕", color: "#98D8C8" },
]

type SortOption = "distance" | "name" | "category" | "hours"

export default function HomePage() {
  const [centers, setCenters] = useState<DonationCenter[]>([])
  const [filteredCenters, setFilteredCenters] = useState<DonationCenter[]>([])
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchRadius, setSearchRadius] = useState([25])
  const [openNowOnly, setOpenNowOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortOption>("distance")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null)

  // Load categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Filter and sort centers when filters change
  useEffect(() => {
    let filtered = [...centers]

    // Filter by categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((center) => center.categories?.some((cat) => selectedCategories.includes(cat.name)))
    }

    // Filter by distance
    filtered = filtered.filter((center) => !center.distance || center.distance <= searchRadius[0])

    // Filter by open now
    if (openNowOnly) {
      filtered = filtered.filter((center) => isOpenNow(center.hours_of_operation))
    }

    // Sort centers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return (a.distance || 0) - (b.distance || 0)
        case "name":
          return a.name.localeCompare(b.name)
        case "category":
          const aCat = a.categories?.[0]?.name || ""
          const bCat = b.categories?.[0]?.name || ""
          return aCat.localeCompare(bCat)
        case "hours":
          const aOpen = isOpenNow(a.hours_of_operation) ? 1 : 0
          const bOpen = isOpenNow(b.hours_of_operation) ? 1 : 0
          return bOpen - aOpen
        default:
          return 0
      }
    })

    setFilteredCenters(filtered)
  }, [centers, selectedCategories, searchRadius, openNowOnly, sortBy])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data)
        }
      }
    } catch (error) {
      console.warn("Error fetching categories, using fallback:", error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Geocode the search query
      const geocodeResponse = await fetch("/api/geocode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: searchQuery }),
      })

      if (!geocodeResponse.ok) {
        throw new Error("Could not find that location. Please try a different address, city, or zip code.")
      }

      const geocodeData = await geocodeResponse.json()

      if (geocodeData.lat && geocodeData.lng) {
        setUserLocation({
          lat: geocodeData.lat,
          lng: geocodeData.lng,
          address: geocodeData.formatted_address || searchQuery,
        })

        // Search for nearby centers
        const centersResponse = await fetch(
          `/api/centers?lat=${geocodeData.lat}&lng=${geocodeData.lng}&radius=${searchRadius[0]}`,
        )

        if (!centersResponse.ok) {
          throw new Error("Failed to find donation centers in that area.")
        }

        const centersData = await centersResponse.json()
        setCenters(Array.isArray(centersData) ? centersData : [])

        if (centersData.length === 0) {
          setError(
            `No donation centers found within ${searchRadius[0]} miles of ${geocodeData.formatted_address || searchQuery}. Try expanding your search radius.`,
          )
        }
      } else {
        throw new Error("Could not find coordinates for that location.")
      }
    } catch (error) {
      console.error("Error searching:", error)
      setError(error instanceof Error ? error.message : "An error occurred while searching")
    } finally {
      setLoading(false)
    }
  }

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude, address: "Your current location" })

        try {
          const response = await fetch(`/api/centers?lat=${latitude}&lng=${longitude}&radius=${searchRadius[0]}`)

          if (!response.ok) {
            throw new Error("Failed to find donation centers near your location")
          }

          const data = await response.json()
          setCenters(Array.isArray(data) ? data : [])

          if (data.length === 0) {
            setError(
              `No donation centers found within ${searchRadius[0]} miles of your location. Try expanding your search radius.`,
            )
          }
        } catch (error) {
          console.error("Error fetching centers:", error)
          setError("Failed to find donation centers near your location")
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        console.error("Error getting location:", error)
        let errorMessage = "Unable to get your current location. "
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access and try again."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable."
            break
          case error.TIMEOUT:
            errorMessage += "Location request timed out."
            break
          default:
            errorMessage += "Please try entering an address instead."
            break
        }
        setError(errorMessage)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const handleCategoryToggle = (categoryName: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryName) ? prev.filter((c) => c !== categoryName) : [...prev, categoryName],
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSearchRadius([25])
    setOpenNowOnly(false)
    setSortBy("distance")
  }

  const getDirections = (center: DonationCenter) => {
    const destination = encodeURIComponent(`${center.address}, ${center.city}, ${center.state}`)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    window.open(url, "_blank")
  }

  const shareCenter = (center: DonationCenter) => {
    if (navigator.share) {
      navigator.share({
        title: center.name,
        text: `Check out ${center.name} - ${center.description}`,
        url: window.location.href,
      })
    } else {
      // Fallback: copy to clipboard
      const text = `${center.name}\n${center.address}, ${center.city}, ${center.state}\n${center.phone || ""}`
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
              <h1 className="text-2xl font-bold text-primary">KindKart</h1>
            </div>
            <p className="text-sm text-muted-foreground hidden md:block">
              Find nearby donation centers and make a difference in your community
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 max-w-4xl mx-auto">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-2">Find Donation Centers Near You</h2>
            <p className="text-muted-foreground text-center mb-6">
              Discover local places to donate food, clothing, and other essentials
            </p>

            {/* Search Input */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Enter your address, city, or zip code (e.g., '90210', 'New York, NY', '123 Main St')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="h-12"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} className="h-12 px-6">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                onClick={handleGetCurrentLocation}
                disabled={loading}
                className="h-12 px-6 bg-transparent"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use My Location
              </Button>
            </div>

            {/* Current Location Display */}
            {userLocation && (
              <div className="text-center mb-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {userLocation.address || "Current location"}
                </Badge>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters & Options
                </h3>
                <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                  Clear All
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Categories</Label>
                  <div className="flex flex-wrap gap-1">
                    {categories.slice(0, 4).map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleCategoryToggle(category.name)}
                        className="text-xs"
                      >
                        <span className="mr-1">{category.icon}</span>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                  {categories.length > 4 && (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="mt-2 text-xs">
                          +{categories.length - 4} more
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>All Categories</SheetTitle>
                          <SheetDescription>Select the types of donation centers you're looking for</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-2 mt-4">
                          {categories.map((category) => (
                            <Button
                              key={category.id}
                              variant={selectedCategories.includes(category.name) ? "default" : "outline"}
                              onClick={() => handleCategoryToggle(category.name)}
                              className="justify-start"
                            >
                              <span className="mr-2">{category.icon}</span>
                              {category.name}
                            </Button>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}
                </div>

                {/* Distance Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Search Radius: {searchRadius[0]} miles</Label>
                  <Slider
                    value={searchRadius}
                    onValueChange={setSearchRadius}
                    max={50}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>1 mile</span>
                    <span>50 miles</span>
                  </div>
                </div>

                {/* Open Now Filter */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="open-now" checked={openNowOnly} onCheckedChange={setOpenNowOnly} />
                    <Label htmlFor="open-now" className="text-sm">
                      Open now only
                    </Label>
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Sort by</Label>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="hours">Open Now First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {filteredCenters.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  Showing {filteredCenters.length} of {centers.length} donation center
                  {centers.length !== 1 ? "s" : ""}
                </h3>
                {selectedCategories.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">Filtered by: {selectedCategories.join(", ")}</p>
                )}
              </div>
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "map" | "list")}>
                <TabsList>
                  <TabsTrigger value="map">
                    <MapPin className="w-4 h-4 mr-2" />
                    Map
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="w-4 h-4 mr-2" />
                    List
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Tabs value={viewMode} className="w-full">
              <TabsContent value="map" className="mt-0">
                <div className="h-96 rounded-lg overflow-hidden border">
                  <MapView
                    centers={filteredCenters}
                    userLocation={userLocation}
                    onCenterClick={setSelectedCenter}
                    searchRadius={searchRadius[0]}
                  />
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCenters.map((center) => (
                    <Card
                      key={center.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedCenter(center)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center">
                              {center.name}
                              {isOpenNow(center.hours_of_operation) && (
                                <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-800">
                                  Open Now
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {center.address}, {center.city}, {center.state}
                            </CardDescription>
                          </div>
                          {center.distance && (
                            <Badge variant="secondary" className="ml-2 shrink-0">
                              {formatDistance(center.distance)}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {center.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{center.description}</p>
                          )}

                          {center.categories && center.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {center.categories.map((category, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                  style={{ borderColor: category.color }}
                                >
                                  <span className="mr-1">{category.icon}</span>
                                  {category.name}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {center.accepted_items && center.accepted_items.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-1">Accepts:</p>
                              <p className="text-sm text-muted-foreground">
                                {center.accepted_items.slice(0, 3).join(", ")}
                                {center.accepted_items.length > 3 && "..."}
                              </p>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-sm">
                              <p className="font-medium flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Today:
                              </p>
                              <p className="text-muted-foreground">{formatHours(center.hours_of_operation)}</p>
                            </div>
                            <div className="flex gap-2">
                              {center.phone && (
                                <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()}>
                                  <a href={`tel:${center.phone}`}>
                                    <Phone className="w-3 h-3 mr-1" />
                                    Call
                                  </a>
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  getDirections(center)
                                }}
                              >
                                <Navigation className="w-3 h-3 mr-1" />
                                Directions
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Empty State */}
        {filteredCenters.length === 0 && centers.length > 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Filter className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground mb-4">
              No donation centers match your current filters. Try adjusting your search criteria.
            </p>
            <Button onClick={clearAllFilters}>Clear All Filters</Button>
          </div>
        )}

        {/* Initial Empty State */}
        {centers.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Your Search</h3>
            <p className="text-muted-foreground mb-4">Enter your location above to find donation centers near you</p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button variant="outline" onClick={() => setSearchQuery("San Francisco, CA")}>
                Try: San Francisco, CA
              </Button>
              <Button variant="outline" onClick={() => setSearchQuery("90210")}>
                Try: 90210
              </Button>
              <Button variant="outline" onClick={handleGetCurrentLocation}>
                Use My Location
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">
              {searchQuery ? `Searching for donation centers near "${searchQuery}"...` : "Finding your location..."}
            </p>
          </div>
        )}
      </div>

      {/* Center Details Modal/Sheet */}
      {selectedCenter && (
        <Sheet open={!!selectedCenter} onOpenChange={() => setSelectedCenter(null)}>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center justify-between">
                {selectedCenter.name}
                {isOpenNow(selectedCenter.hours_of_operation) && (
                  <Badge className="bg-green-100 text-green-800">Open Now</Badge>
                )}
              </SheetTitle>
              <SheetDescription>
                {selectedCenter.address}, {selectedCenter.city}, {selectedCenter.state}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              {/* Distance and Categories */}
              <div className="flex items-center gap-2">
                {selectedCenter.distance && (
                  <Badge variant="secondary">{formatDistance(selectedCenter.distance)}</Badge>
                )}
                {selectedCenter.categories?.map((category, index) => (
                  <Badge key={index} variant="outline" style={{ borderColor: category.color }}>
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              {selectedCenter.description && (
                <div>
                  <h4 className="font-medium mb-2">About</h4>
                  <p className="text-sm text-muted-foreground">{selectedCenter.description}</p>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h4 className="font-medium mb-3">Contact Information</h4>
                <div className="space-y-3">
                  {selectedCenter.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                      <a href={`tel:${selectedCenter.phone}`} className="text-primary hover:underline">
                        {selectedCenter.phone}
                      </a>
                    </div>
                  )}
                  {selectedCenter.email && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
                      <a href={`mailto:${selectedCenter.email}`} className="text-primary hover:underline">
                        {selectedCenter.email}
                      </a>
                    </div>
                  )}
                  {selectedCenter.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
                      <a
                        href={selectedCenter.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Hours */}
              {selectedCenter.hours_of_operation && (
                <div>
                  <h4 className="font-medium mb-3">Hours of Operation</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedCenter.hours_of_operation).map(([day, hours]) => (
                      <div key={day} className="flex justify-between text-sm">
                        <span className="capitalize font-medium">{day}</span>
                        <span className="text-muted-foreground">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Accepted Items */}
              {selectedCenter.accepted_items && selectedCenter.accepted_items.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Accepted Items</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedCenter.accepted_items.map((item, index) => (
                      <Badge key={index} variant="secondary">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {selectedCenter.special_instructions && (
                <div>
                  <h4 className="font-medium mb-2">Special Instructions</h4>
                  <p className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    {selectedCenter.special_instructions}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <Button onClick={() => getDirections(selectedCenter)} className="w-full">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  {selectedCenter.phone && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${selectedCenter.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => shareCenter(selectedCenter)}>
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
