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

    // Add markers and their corresponding soft blurred safety/danger zone circles
    const circlesList: any[] = [];
    
    markers.forEach((m) => {
      const isUser = m.color === "#06b6d4";
      const marker = new google.maps.Marker({
        position: m.position,
        map,
        title: m.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: m.color,
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: isUser ? 4 : 2.5,
          scale: isUser ? 12 : 9,
        },
      });
      markersRef.current.push(marker);

      if (!isUser) {
        // Descriptions of the state of the route (e.g. dangerous/safe)
        // Multi-layered low-opacity concentric circles to create a realistic blurred glow look on the map
        const radiuses = [150, 100, 50];
        radiuses.forEach((r, idx) => {
          const circle = new google.maps.Circle({
            strokeColor: m.color,
            strokeOpacity: 0.08 / (idx + 1),
            strokeWeight: 1,
            fillColor: m.color,
            fillOpacity: 0.06 / (idx + 1),
            map: map,
            center: m.position,
            radius: r,
            clickable: false,
          });
          circlesList.push(circle);
        });
      } else {
        // Pulsing user glow circles
        const userOuterCircle = new google.maps.Circle({
          strokeColor: "#06b6d4",
          strokeOpacity: 0.25,
          strokeWeight: 1.5,
          fillColor: "#06b6d4",
          fillOpacity: 0.12,
          map: map,
          center: m.position,
          radius: 90,
          clickable: false,
        });
        const userInnerCircle = new google.maps.Circle({
          strokeColor: "#06b6d4",
          strokeOpacity: 0.4,
          strokeWeight: 1,
          fillColor: "#06b6d4",
          fillOpacity: 0.2,
          map: map,
          center: m.position,
          radius: 45,
          clickable: false,
        });
        circlesList.push(userOuterCircle, userInnerCircle);
        // Attach them to marker reference to easily animate their radii on interval
        (marker as any).userOuterCircle = userOuterCircle;
        (marker as any).userInnerCircle = userInnerCircle;
      }
    });

    let isBright = true;
    const blinkInterval = setInterval(() => {
      isBright = !isBright;
      markersRef.current.forEach((marker, idx) => {
        if (markers[idx] && markers[idx].color === "#06b6d4") {
          // Pulse the blinking dot
          marker.setIcon({
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#06b6d4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: isBright ? 4 : 2,
            scale: isBright ? 13 : 8,
          });

          // Pulse the radii of user blurred circles to make it look active/alive!
          const outer = (marker as any).userOuterCircle;
          const inner = (marker as any).userInnerCircle;
          if (outer && inner) {
            outer.setRadius(isBright ? 110 : 80);
            outer.setOptions({ fillOpacity: isBright ? 0.15 : 0.08, strokeOpacity: isBright ? 0.3 : 0.18 });
            inner.setRadius(isBright ? 55 : 40);
            inner.setOptions({ fillOpacity: isBright ? 0.25 : 0.15, strokeOpacity: isBright ? 0.5 : 0.3 });
          }
        }
      });
    }, 500);

    return () => {
      clearInterval(blinkInterval);
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      circlesList.forEach((c) => c.setMap(null));
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