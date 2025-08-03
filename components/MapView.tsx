"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import MarkerClusterGroup from "leaflet.markercluster"
import { isOpenNow } from "@/lib/utils"
import type { DonationCenter } from "@/lib/types"

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface MapViewProps {
  centers: DonationCenter[]
  userLocation?: { lat: number; lng: number } | null
  onCenterClick?: (center: DonationCenter) => void
  searchRadius?: number
}

export default function MapView({ centers, userLocation, onCenterClick, searchRadius }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<MarkerClusterGroup | null>(null)
  const radiusCircleRef = useRef<L.Circle | null>(null)

  const getCenterColor = (center: DonationCenter): string => {
    if (center.categories && center.categories.length > 0) {
      return center.categories[0].color
    }
    return "#ef4444" // Default red
  }

  useEffect(() => {
    if (!mapRef.current) return

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([37.7749, -122.4194], 10)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)

      // Initialize marker cluster group
      markersRef.current = MarkerClusterGroup().addTo(mapInstanceRef.current)
    }

    const map = mapInstanceRef.current
    const markersGroup = markersRef.current!

    // Clear existing markers and radius circle
    markersGroup.clearLayers()
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current)
      radiusCircleRef.current = null
    }

    // Add user location marker and radius circle
    if (userLocation) {
      const userIcon = L.divIcon({
        html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
        className: "user-location-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .bindPopup("Your Location")
        .addTo(markersGroup)

      // Add search radius circle
      if (searchRadius) {
        radiusCircleRef.current = L.circle([userLocation.lat, userLocation.lng], {
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.1,
          radius: searchRadius * 1609.34, // Convert miles to meters
          weight: 2,
        }).addTo(map)
      }
    }

    // Add center markers with clustering for better performance
    centers.forEach((center) => {
      const isOpen = isOpenNow(center.hours_of_operation)
      const centerColor = getCenterColor(center)

      const centerIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${centerColor}; 
            width: 16px; 
            height: 16px; 
            border-radius: 50%; 
            border: 2px solid white; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: bold;
            color: white;
          ">
          </div>
        `,
        className: "center-marker",
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })

      const popupContent = `
        <div style="min-width: 250px; max-width: 300px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px; display: flex; align-items: center; gap: 8px;">
            ${center.name}
            ${isOpen ? '<span style="background: #22c55e; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">OPEN</span>' : ""}
          </h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${center.address}, ${center.city}, ${center.state}</p>
          ${center.description ? `<p style="margin: 0 0 8px 0; font-size: 14px;">${center.description}</p>` : ""}
          ${
            center.categories && center.categories.length > 0
              ? `<div style="margin: 0 0 8px 0;">
              ${center.categories.map((cat) => `<span style="background: ${cat.color}20; color: ${cat.color}; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-right: 4px;">${cat.icon} ${cat.name}</span>`).join("")}
            </div>`
              : ""
          }
          ${
            center.accepted_items && center.accepted_items.length > 0
              ? `<p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Accepts:</strong> ${center.accepted_items.slice(0, 3).join(", ")}</p>`
              : ""
          }
          ${center.distance ? `<p style="margin: 0 0 8px 0; font-size: 14px; color: #3b82f6;"><strong>${center.distance.toFixed(1)} miles away</strong></p>` : ""}
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            ${center.phone ? `<a href="tel:${center.phone}" style="background: #3b82f6; color: white; padding: 6px 12px; border-radius: 4px; text-decoration: none; font-size: 12px;">📞 Call</a>` : ""}
            <button onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(center.address + ", " + center.city + ", " + center.state)}', '_blank')" style="background: #22c55e; color: white; padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer; font-size: 12px;">🧭 Directions</button>
            <button onclick="window.dispatchEvent(new CustomEvent('centerClick', { detail: ${JSON.stringify(center).replace(/"/g, "&quot;")} }))" style="background: #6b7280; color: white; padding: 6px 12px; border-radius: 4px; border: none; cursor: pointer; font-size: 12px;">ℹ️ Details</button>
          </div>
        </div>
      `

      const marker = L.marker([center.latitude, center.longitude], { icon: centerIcon })
        .bindPopup(popupContent)
        .addTo(markersGroup)

      // Handle center click events
      marker.on("click", () => {
        if (onCenterClick) {
          onCenterClick(center)
        }
      })
    })

    // Listen for custom center click events from popup buttons
    const handleCenterClick = (event: any) => {
      if (onCenterClick && event.detail) {
        onCenterClick(event.detail)
      }
    }

    window.addEventListener("centerClick", handleCenterClick)

    // Fit map to show all markers
    if (centers.length > 0 || userLocation) {
      const group = new L.FeatureGroup()

      if (userLocation) {
        group.addLayer(L.marker([userLocation.lat, userLocation.lng]))
      }

      centers.forEach((center) => {
        group.addLayer(L.marker([center.latitude, center.longitude]))
      })

      if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds(), { padding: [20, 20], maxZoom: 15 })
      }
    }

    return () => {
      window.removeEventListener("centerClick", handleCenterClick)
    }
  }, [centers, userLocation, searchRadius, onCenterClick])

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return <div ref={mapRef} className="w-full h-full" />
}
