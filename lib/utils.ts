import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959 // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Check if a center is currently open
export function isOpenNow(hours?: Record<string, string>): boolean {
  if (!hours) return false
  const now = new Date()
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  const currentTime = now.getHours() * 100 + now.getMinutes()

  const todayHours = hours[dayName]
  if (!todayHours || todayHours.toLowerCase().includes("closed")) return false
  if (todayHours.includes("24 hours")) return true

  // Parse hours like "9:00 AM - 5:00 PM"
  const timeMatch = todayHours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i)
  if (!timeMatch) return false

  const [, startHour, startMin, startPeriod, endHour, endMin, endPeriod] = timeMatch
  let start = Number.parseInt(startHour) * 100 + Number.parseInt(startMin)
  let end = Number.parseInt(endHour) * 100 + Number.parseInt(endMin)

  if (startPeriod.toUpperCase() === "PM" && Number.parseInt(startHour) !== 12) start += 1200
  if (endPeriod.toUpperCase() === "PM" && Number.parseInt(endHour) !== 12) end += 1200
  if (startPeriod.toUpperCase() === "AM" && Number.parseInt(startHour) === 12) start -= 1200
  if (endPeriod.toUpperCase() === "AM" && Number.parseInt(endHour) === 12) end -= 1200

  return currentTime >= start && currentTime <= end
}

// Format distance for display
export function formatDistance(distance?: number): string {
  if (!distance) return ""
  if (distance < 1) return `${(distance * 5280).toFixed(0)} ft away`
  return `${distance.toFixed(1)} miles away`
}

// Format hours for display
export function formatHours(hours?: Record<string, string>): string {
  if (!hours) return "Hours not available"
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
  return hours[today] || "Hours not available"
}
