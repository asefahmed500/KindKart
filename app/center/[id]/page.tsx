import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Globe, Clock, Package, AlertCircle } from "lucide-react"

interface CenterPageProps {
  params: {
    id: string
  }
}

async function getCenter(id: string) {
  try {
    const centerId = Number.parseInt(id)
    if (isNaN(centerId)) return null

    const center = await prisma.donationCenter.findUnique({
      where: {
        id: centerId,
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

    return center
  } catch (error) {
    console.error("Error fetching center:", error)
    return null
  }
}

export default async function CenterPage({ params }: CenterPageProps) {
  const center = await getCenter(params.id)

  if (!center) {
    notFound()
  }

  const formatHours = (hours: any) => {
    if (!hours) return []
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    return days.map((day, index) => ({
      day: dayNames[index],
      hours: hours[day] || "Closed",
    }))
  }

  const categories = center.centerCategories.map((cc) => ({
    name: cc.category.name,
    icon: cc.category.icon,
    color: cc.category.color,
  }))

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{center.name}</h1>
            <div className="flex items-center text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              <span>
                {center.address}, {center.city}, {center.state} {center.zipCode}
              </span>
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => (
                  <Badge key={index} variant="outline" style={{ borderColor: category.color }}>
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Main Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  About This Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {center.description && <p className="text-muted-foreground">{center.description}</p>}

                {center.organizationType && (
                  <div>
                    <h4 className="font-medium mb-1">Organization Type</h4>
                    <p className="text-muted-foreground">{center.organizationType}</p>
                  </div>
                )}

                {center.acceptedItems && center.acceptedItems.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Accepted Items</h4>
                    <div className="flex flex-wrap gap-1">
                      {center.acceptedItems.map((item: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {center.specialInstructions && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Special Instructions
                    </h4>
                    <p className="text-sm text-muted-foreground bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      {center.specialInstructions}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact & Hours */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {center.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                      <a href={`tel:${center.phone}`} className="text-primary hover:underline">
                        {center.phone}
                      </a>
                    </div>
                  )}

                  {center.email && (
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                      <a href={`mailto:${center.email}`} className="text-primary hover:underline">
                        {center.email}
                      </a>
                    </div>
                  )}

                  {center.website && (
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-3 text-muted-foreground" />
                      <a
                        href={center.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button asChild className="w-full">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(center.address + ", " + center.city + ", " + center.state)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Get Directions
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              {center.hoursOfOperation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Hours of Operation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {formatHours(center.hoursOfOperation).map((dayInfo, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="font-medium">{dayInfo.day}</span>
                          <span className="text-muted-foreground">{dayInfo.hours}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
