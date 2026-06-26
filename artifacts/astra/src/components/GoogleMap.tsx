import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface Marker {
  position: { lat: number; lng: number };
  title: string;
  color: string;
}

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Marker[];
  className?: string;
}

export function GoogleMap({ 
  center, 
  zoom = 15, 
  markers = [], 
  className = "" 
}: GoogleMapProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { loaded, error } = useGoogleMaps();

  useEffect(() => {
    if (!loaded || !divRef.current) return;

    const google = (window as any).google;

    // Create map with NO custom styles - let Google Maps use its default
    const map = new google.maps.Map(divRef.current, {
      center,
      zoom,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: "greedy",
      mapTypeId: "roadmap",
      // NO styles array - this was breaking the map!
    });

    mapRef.current = map;

    // Add markers
    markers.forEach((m) => {
      const marker = new google.maps.Marker({
        position: m.position,
        map,
        title: m.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: m.color,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 10,
        },
      });
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      mapRef.current = null;
    };
  }, [loaded, center, zoom, markers]);

  if (error) {
    return (
      <div 
        className={className}
        style={{ 
          width: "100%", 
          height: "100%",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f1f5f9",
          color: "#ef4444",
          borderRadius: "12px",
        }}
      >
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">🗺️ Map Error</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div 
        className={className}
        style={{ 
          width: "100%", 
          height: "100%",
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f1f5f9",
          borderRadius: "12px",
        }}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-rose-500 rounded-full animate-spin" />
          <span className="text-slate-600 text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={divRef} 
      className={className}
      style={{ 
        width: "100%", 
        height: "100%",
        minHeight: "400px",
        borderRadius: "12px",
        overflow: "hidden",
      }} 
    />
  );
}