"use client"

import { useEffect, useRef, useCallback } from "react"
import type { ProcessedRegion, RiskLevel } from "@/lib/types"
import { moroccoRegionsGeoJSON } from "@/lib/moroccoGeo"

interface MoroccoMapProps {
  regions: ProcessedRegion[]
  selectedRegion: ProcessedRegion | null
  onSelectRegion: (region: ProcessedRegion | null) => void
}

function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "LOW":
      return "#22c55e"
    case "MEDIUM":
      return "#f59e0b"
    case "HIGH":
      return "#ef4444"
  }
}

function getRiskFillOpacity(level: RiskLevel): number {
  switch (level) {
    case "LOW":
      return 0.45
    case "MEDIUM":
      return 0.55
    case "HIGH":
      return 0.65
  }
}

export function MoroccoMap({ regions, selectedRegion, onSelectRegion }: MoroccoMapProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geoLayerRef = useRef<any>(null)
  const regionsRef = useRef(regions)
  const selectedRef = useRef(selectedRegion)
  const onSelectRef = useRef(onSelectRegion)

  regionsRef.current = regions
  selectedRef.current = selectedRegion
  onSelectRef.current = onSelectRegion

  const buildGeoLayer = useCallback(async () => {
    if (!mapRef.current || regionsRef.current.length === 0) return

    const L = (await import("leaflet")).default

    if (geoLayerRef.current) {
      geoLayerRef.current.remove()
    }

    const regionMap = new Map<string, ProcessedRegion>()
    regionsRef.current.forEach((r) => regionMap.set(r.region_name, r))

    geoLayerRef.current = L.geoJSON(moroccoRegionsGeoJSON, {
      style: (feature) => {
        const name = feature?.properties?.name ?? ""
        const region = regionMap.get(name)
        const level = region?.overall_level ?? "LOW"
        const isSelected = selectedRef.current?.region_name === name
        const fillColor = getRiskColor(level)
        // Selected: slightly brighter fill, subtle border (no heavy outline)
        return {
          fillColor,
          fillOpacity: isSelected ? 0.88 : getRiskFillOpacity(level),
          color: "#ffffff",
          weight: isSelected ? 2 : 1.5,
          opacity: isSelected ? 0.9 : 0.85,
        }
      },
      onEachFeature: (feature, layer) => {
        const name = feature?.properties?.name ?? ""
        const region = regionMap.get(name)

        if (region) {
          const pop = region.indicators.population
          const wq = region.indicators.water_quality_index
          const popStr = pop >= 1e6 ? `${(pop / 1e6).toFixed(1)}M` : pop.toLocaleString()
          layer.bindTooltip(
            `<div style="font-family:system-ui;padding:4px 0;min-width:180px;">
              <strong style="font-size:14px;">${name}</strong><br/>
              <div style="margin-top:4px;font-size:12px;">
                <span style="color:${getRiskColor(region.overall_level)};font-weight:600;">
                  ${region.overall_level} Risk
                </span>
                <span style="opacity:0.7;margin-left:4px;">(${region.overall_score.toFixed(1)})</span>
              </div>
              <div style="margin-top:6px;font-size:11px;opacity:0.8;line-height:1.4;">
                Population: ${popStr}<br/>
                Water Quality: ${wq}/100
              </div>
            </div>`,
            {
              sticky: true,
              className: "custom-tooltip",
              direction: "top",
              offset: [0, -10]
            }
          )

          layer.on("click", (e) => {
            onSelectRef.current(region)
            L.DomEvent.stopPropagation(e)
          })

          layer.on("mouseover", (e) => {
            const target = e.target
            const isCurrentlySelected = selectedRef.current?.region_name === name
            target.setStyle({
              fillOpacity: 0.92,
              weight: isCurrentlySelected ? 2 : 2,
              color: "#ffffff",
              opacity: 0.95,
            })
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
              target.bringToFront()
            }
          })

          layer.on("mouseout", (e) => {
            if (geoLayerRef.current) {
              geoLayerRef.current.resetStyle(e.target)
            }
          })
        }
      },
    }).addTo(mapRef.current)

    const bounds = geoLayerRef.current.getBounds()
    mapRef.current.fitBounds(bounds, { padding: [24, 24] })
    mapRef.current.setMaxBounds(bounds.pad(0.15))
  }, [])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    let cancelled = false

    async function init() {
      const L = (await import("leaflet")).default
      // @ts-expect-error - Leaflet CSS has no type declarations
      await import("leaflet/dist/leaflet.css")

      if (cancelled || !containerRef.current) return

      mapRef.current = L.map(containerRef.current, {
        center: [31.7917, -7.0926],
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: true,
        doubleClickZoom: false,
        touchZoom: false,
        minZoom: 5,
        maxZoom: 10,
      })

      // Zoom only via buttons
      L.control.zoom({ position: "topright" }).addTo(mapRef.current)

      // No world tiles – Morocco only on a clean background (handled by CSS .leaflet-container)
      buildGeoLayer()

      // Click on map background to deselect
      mapRef.current.on('click', () => {
        if (selectedRef.current) {
          onSelectRef.current(null)
        }
      })
    }

    init()

    return () => {
      cancelled = true
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [buildGeoLayer])

  useEffect(() => {
    buildGeoLayer()
  }, [regions, selectedRegion, buildGeoLayer])

  // Pan to center selected region (no zoom change – zoom only via buttons)
  useEffect(() => {
    if (!mapRef.current || !geoLayerRef.current || !selectedRegion) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    geoLayerRef.current.eachLayer((layer: any) => {
      const name = layer.feature?.properties?.name ?? ""
      if (name === selectedRegion.region_name) {
        const center = layer.getBounds().getCenter()
        mapRef.current.panTo(center, { animate: true, duration: 0.25 })
      }
    })
  }, [selectedRegion])

  return (
    <>
      <style>{`
        .custom-tooltip {
          background: rgba(255, 255, 255, 0.98) !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          border-radius: 8px !important;
          color: #1f2937 !important;
          padding: 10px 14px !important;
          font-size: 13px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
          line-height: 1.4 !important;
          backdrop-filter: blur(10px);
        }
        .custom-tooltip::before {
          border-top-color: rgba(255, 255, 255, 0.98) !important;
        }
        .leaflet-container {
          background: linear-gradient(145deg, #f3f4f6 0%, #e5e7eb 100%) !important;
          font-family: system-ui, -apple-system, sans-serif !important;
          cursor: grab !important;
        }
        .leaflet-tile-pane { display: none !important; }
        .leaflet-container:active {
          cursor: grabbing !important;
        }
        .leaflet-control-zoom a {
          background: rgba(255, 255, 255, 0.95) !important;
          color: #1f2937 !important;
          border: 1px solid rgba(0, 0, 0, 0.1) !important;
          width: 34px !important;
          height: 34px !important;
          line-height: 34px !important;
          font-size: 20px !important;
          border-radius: 6px !important;
          font-weight: 600 !important;
          transition: all 0.2s ease !important;
        }
        .leaflet-control-zoom a:hover {
          background: #ffffff !important;
          color: #3b82f6 !important;
          transform: scale(1.05);
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
        }
        .leaflet-control-zoom-in {
          margin-bottom: 4px !important;
        }
        /* Smooth transitions for region interactions */
        .leaflet-interactive {
          transition: all 0.2s ease !important;
          cursor: pointer !important;
        }
        .leaflet-interactive:hover {
          filter: brightness(1.05);
        }
      `}</style>
      <div ref={containerRef} className="h-full w-full rounded-lg shadow-sm" />
    </>
  )
}