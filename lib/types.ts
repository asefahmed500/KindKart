import type { Prisma } from "@prisma/client"

export type DonationCenterWithCategories = Prisma.DonationCenterGetPayload<{
  include: {
    centerCategories: {
      include: {
        category: true
      }
    }
  }
}> & {
  distance?: number
}

export type CategoryType = Prisma.CategoryGetPayload<{}>

export interface SearchFilters {
  categories: string[]
  radius: number
  openNowOnly: boolean
  sortBy: "distance" | "name" | "category" | "hours"
}

export interface LocationData {
  lat: number
  lng: number
  address?: string
}

export interface DonationCenter {
  id: number
  name: string
  address: string
  city: string
  state: string
  zip_code: string
  latitude: number
  longitude: number
  phone?: string
  email?: string
  website?: string
  hours_of_operation?: Record<string, string>
  accepted_items?: string[]
  organization_type?: string
  description?: string
  special_instructions?: string
  distance?: number
  categories?: Array<{ name: string; icon: string; color: string }>
}
