import { useRef, useEffect, useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, CircleF } from "@react-google-maps/api";
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

const LIVE_USER_CENTER = { lat: 12.9716, lng: 77.5946 }; // Bangalore fallback

export function MapBackground({ active = false }: { active?: boolean }) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [userCenter, setUserCenter] = useState<google.maps.LatLngLiteral | null>(null);
  const [userState, setUserState] = useState("");

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

  const center = useMemo(() => userCenter || getMapCenterFromUser(), [userCenter]);
  const zoom = useMemo(() => getZoomLevel(userState), [userState]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    // Try to get live location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const live = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCenter(live);
          map.setCenter(live);
          map.setZoom(15);
        },
        () => {
          // Fallback: stay on state center
        },
        { enableHighAccuracy: false, timeout: 5000 }
      );
    }
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  if (loadError) {
    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#080f1c]">
        <p className="text-slate-500 text-xs">Map failed to load</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-[#080f1c]">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={mapOptions}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* User marker (approximate from state center) */}
      <MarkerF
        position={center}
        icon={{
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#14b8a6",
          fillOpacity: 1,
          strokeColor: "#0a0f1e",
          strokeWeight: 2,
        }}
      />

      {/* Live user marker if geolocation worked */}
      {userCenter && (
        <>
          <CircleF
            center={userCenter}
            radius={50}
            options={{
              fillColor: "#14b8a6",
              fillOpacity: 0.15,
              strokeColor: "#14b8a6",
              strokeOpacity: 0.3,
              strokeWeight: 1,
            }}
          />
          <MarkerF
            position={userCenter}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#14b8a6",
              fillOpacity: 1,
              strokeColor: "#0a0f1e",
              strokeWeight: 2,
            }}
          />
        </>
      )}

      {/* Guardian markers (mock) */}
      {[
        { pos: { lat: center.lat + 0.008, lng: center.lng - 0.006 }, label: "Ananya" },
        { pos: { lat: center.lat - 0.005, lng: center.lng + 0.01 }, label: "Meera" },
      ].map((g, i) => (
        <MarkerF
          key={i}
          position={g.pos}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 5,
            fillColor: "#e85d7a",
            fillOpacity: 1,
            strokeColor: "#0a0f1e",
            strokeWeight: 1.5,
          }}
        />
      ))}
    </GoogleMap>
  );
}