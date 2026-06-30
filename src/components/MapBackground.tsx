import { useRef, useEffect, useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, CircleF, PolylineF } from "@react-google-maps/api";
import { getMapCenterFromUser, getZoomLevel } from "@/lib/indiaStates";

const containerStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  draggable: false,
  scrollwheel: false,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

export function MapBackground({ 
  active = false, 
  progress = 0,
  routePreference = "safe",
  liveLocation = null
}: { 
  active?: boolean; 
  progress?: number;
  routePreference?: "safe" | "shortest";
  liveLocation?: google.maps.LatLngLiteral | null;
}) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [userCenter, setUserCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [userState, setUserState] = useState("");
  const [blink, setBlink] = useState(true);

  const center = useMemo(() => userCenter || getMapCenterFromUser(), [userCenter]);
  const zoom = useMemo(() => {
    const baseZoom = getZoomLevel(userState);
    return active ? baseZoom + 6 : baseZoom; // zoom in closer when in active walk
  }, [userState, active]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (navigator.geolocation && !active) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const live = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCenter(live);
          map.setCenter(live);
        },
        () => {},
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  // Complete Route Path with multi-turn road turns
  const routePath = useMemo(() => {
    const startCoord = center;
    const endCoord = { lat: center.lat + 0.003, lng: center.lng + 0.003 };
    
    if (routePreference === "shortest") {
      // Cut straight through the dangerous area
      const dangerPt = { lat: center.lat + 0.0012, lng: center.lng + 0.0012 };
      return [startCoord, dangerPt, endCoord];
    } else {
      // Elegant, well-lit safe bypass path turning around the danger zone
      const p1 = { lat: center.lat + 0.0006, lng: center.lng + 0.0002 };
      const p2 = { lat: center.lat + 0.0014, lng: center.lng - 0.0003 };
      const p3 = { lat: center.lat + 0.0024, lng: center.lng + 0.0012 };
      return [startCoord, p1, p2, p3, endCoord];
    }
  }, [center, routePreference]);

  // Interpolated user coordinate along route
  const currentPosition = useMemo(() => {
    if (liveLocation) return liveLocation;
    if (routePath.length === 0) return center;
    const fraction = Math.min(Math.max(progress / 100, 0), 1);
    if (fraction <= 0) return routePath[0];
    if (fraction >= 1) return routePath[routePath.length - 1];

    const totalSegments = routePath.length - 1;
    const scaledProgress = fraction * totalSegments;
    const segmentIndex = Math.floor(scaledProgress);
    const segmentFraction = scaledProgress - segmentIndex;

    const start = routePath[segmentIndex];
    const end = routePath[segmentIndex + 1];

    return {
      lat: start.lat + (end.lat - start.lat) * segmentFraction,
      lng: start.lng + (end.lng - start.lng) * segmentFraction
    };
  }, [routePath, progress, center, liveLocation]);

  // Walked Path Segment (highlighted in different color)
  const walkedPath = useMemo(() => {
    if (routePath.length === 0) return [center];
    const fraction = Math.min(Math.max(progress / 100, 0), 1);
    if (fraction <= 0) return [routePath[0]];

    const path: google.maps.LatLngLiteral[] = [];
    const totalSegments = routePath.length - 1;
    const scaledProgress = fraction * totalSegments;
    const segmentIndex = Math.floor(scaledProgress);

    for (let i = 0; i <= segmentIndex; i++) {
      path.push(routePath[i]);
    }
    path.push(currentPosition);
    return path;
  }, [routePath, currentPosition, progress, center]);

  // Safe and Dangerous sector positions to show blurred safety status circles
  const dangerousSectorCenter = useMemo(() => {
    return { lat: center.lat + 0.001, lng: center.lng + 0.001 };
  }, [center]);

  const safeSectorCenter = useMemo(() => {
    return { lat: center.lat + 0.0022, lng: center.lng + 0.0022 };
  }, [center]);

  // Blinking dot timer
  useEffect(() => {
    const t = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(t);
  }, []);

  // Smoothly pan map to follow user's live progress
  useEffect(() => {
    if (active && mapRef.current && currentPosition) {
      mapRef.current.panTo(currentPosition);
    }
  }, [active, currentPosition]);

  // Read user's saved state
  useEffect(() => {
    try {
      const raw = localStorage.getItem("astra_user");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.state) setUserState(data.state);
      }
    } catch { /* ignore */ }
  }, []);

  if (loadError) {
    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Map failed to load</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-50">
        <div className="w-6 h-6 border-2 border-[#0d9488] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={{
        ...mapOptions,
        zoomControl: false,
        disableDefaultUI: true,
      }}
      center={active ? currentPosition : center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* 1. Walk Route Polylines */}
      {active && (
        <>
          {/* Unwalked segment / full route backdrop (dashed or light gray) */}
          <PolylineF
            path={routePath}
            options={{
              strokeColor: "#94a3b8",
              strokeOpacity: 0.6,
              strokeWeight: 4,
            }}
          />
          {/* Highlighted walked segment (vibrant teal cyan) */}
          <PolylineF
            path={walkedPath}
            options={{
              strokeColor: "#06b6d4",
              strokeOpacity: 1,
              strokeWeight: 6,
            }}
          />
        </>
      )}

      {/* 2. Safety Status Blurred Circles (using multiple concentric low-opacity layers to mock a real blur/glow) */}
      {/* Red/Danger Circle (Dim lights / alert sector) */}
      {[120, 90, 60, 30].map((radius, index) => (
        <CircleF
          key={`danger-blur-${radius}`}
          center={dangerousSectorCenter}
          radius={radius}
          options={{
            fillColor: "#ef4444",
            fillOpacity: 0.07,
            strokeColor: "#ef4444",
            strokeOpacity: 0.1,
            strokeWeight: 1,
            clickable: false,
          }}
        />
      ))}

      {/* Green/Safe Circle (Guardian Patrol Corridor) */}
      {[140, 100, 70, 35].map((radius, index) => (
        <CircleF
          key={`safe-blur-${radius}`}
          center={safeSectorCenter}
          radius={radius}
          options={{
            fillColor: "#10b981",
            fillOpacity: 0.06,
            strokeColor: "#10b981",
            strokeOpacity: 0.08,
            strokeWeight: 1,
            clickable: false,
          }}
        />
      ))}

      {/* 3. Blinking glowing dot representing person standing */}
      <MarkerF
        position={currentPosition}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: blink ? 11 : 7,
          fillColor: "#06b6d4",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 3,
        }}
      />

      {/* Live outer breathing glow layer */}
      <CircleF
        center={currentPosition}
        radius={15}
        options={{
          fillColor: "#06b6d4",
          fillOpacity: blink ? 0.25 : 0.05,
          strokeColor: "#06b6d4",
          strokeOpacity: blink ? 0.4 : 0.1,
          strokeWeight: 1.5,
          clickable: false,
        }}
      />

      {/* Guardian markers (mock) */}
      {[
        { pos: { lat: center.lat + 0.0018, lng: center.lng - 0.0008 }, label: "Ananya" },
        { pos: { lat: center.lat - 0.001, lng: center.lng + 0.0012 }, label: "Meera" },
      ].map((g, i) => (
        <MarkerF
          key={i}
          position={g.pos}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: "#e85d7a",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 1,
          }}
        />
      ))}
    </GoogleMap>
  );
}
