import { useRef, useEffect, useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, MarkerF, CircleF, PolylineF } from "@react-google-maps/api";
import { getMapCenterFromUser, getZoomLevel } from "@/lib/indiaStates";
import { subscribeToGuardians } from "@/lib/firebaseService";
import { GuardianLocation } from "@/types/safety";

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
  const [liveGuardians, setLiveGuardians] = useState<GuardianLocation[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToGuardians((data) => {
      setLiveGuardians(data);
    });
    return () => unsubscribe();
  }, []);

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

  const hasApiKey = useMemo(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    return !!(key && key !== "your_google_maps_api_key_here" && key.trim() !== "");
  }, []);

  if (!hasApiKey) {
    // Elegant, interactive vector tactical radar map fallback
    const getXY = (pos: { lat: number; lng: number }) => {
      const latSpan = 0.005;
      const lngSpan = 0.005;
      // Map center (user center) to middle of SVG (200, 200)
      const x = 200 + ((pos.lng - center.lng) / lngSpan) * 160;
      const y = 200 - ((pos.lat - center.lat) / latSpan) * 160;
      return { x, y };
    };

    const dangerXY = getXY(dangerousSectorCenter);
    const safeXY = getXY(safeSectorCenter);
    const currentXY = getXY(currentPosition);

    const routePoints = routePath.map(pos => {
      const { x, y } = getXY(pos);
      return `${x},${y}`;
    }).join(" ");

    const walkedPoints = walkedPath.map(pos => {
      const { x, y } = getXY(pos);
      return `${x},${y}`;
    }).join(" ");

    const guardian1 = getXY({ lat: center.lat + 0.0018, lng: center.lng - 0.0008 });
    const guardian2 = getXY({ lat: center.lat - 0.001, lng: center.lng + 0.0012 });

    return (
      <div className="absolute inset-0 z-0 bg-[#0f172a] overflow-hidden flex flex-col justify-end select-none">
        {/* Modern Cyberpunk Map Grid Backdrop */}
        <div className="absolute inset-0 z-0 opacity-10" style={{
          backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />

        {/* Floating Compass Decal */}
        <div className="absolute bottom-24 right-4 z-20 w-12 h-12 rounded-full border border-slate-700/65 bg-slate-900/80 flex items-center justify-center text-slate-400 text-[10px] font-mono font-black shadow-lg">
          <div className="animate-spin" style={{ animationDuration: "25s" }}>🧭</div>
        </div>

        {/* Tactical UI Header Overlay */}
        <div className="absolute top-16 left-4 right-4 z-20 flex justify-between items-center bg-slate-950/80 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">
              Astra Tactical Radar
            </span>
          </div>
          <span className="text-[8px] font-mono font-black text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Demo Map Active
          </span>
        </div>

        {/* SVG Core Map Graphics */}
        <svg className="w-full h-full relative z-10" viewBox="0 0 400 400">
          {/* Street Outlines */}
          {/* Main Diagonal Highway */}
          <line x1="20" y1="380" x2="380" y2="20" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
          <line x1="20" y1="380" x2="380" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.6" />

          {/* Cross Street Beacon Rd */}
          <line x1="20" y1="200" x2="380" y2="200" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
          <line x1="20" y1="200" x2="380" y2="200" stroke="#334155" strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />

          {/* Circular Safe Perimeter Bypass Road */}
          <circle cx="200" cy="200" r="130" fill="none" stroke="#1e293b" strokeWidth="8" strokeDasharray="10,6" opacity="0.3" />

          {/* Safety/Risk Sectors */}
          {/* Unlit Danger Hotspot (Red pulse) */}
          <circle cx={dangerXY.x} cy={dangerXY.y} r="55" fill="#ef4444" fillOpacity="0.06" stroke="#ef4444" strokeOpacity="0.12" strokeWidth="1" />
          <circle cx={dangerXY.x} cy={dangerXY.y} r="25" fill="#ef4444" fillOpacity="0.08" />
          <text x={dangerXY.x} y={dangerXY.y + 3} fill="#fca5a5" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono uppercase tracking-widest opacity-80">
            ⚠ Dim Alleys
          </text>

          {/* Safe Patrol Corridor (Green pulse) */}
          <circle cx={safeXY.x} cy={safeXY.y} r="70" fill="#10b981" fillOpacity="0.05" stroke="#10b981" strokeOpacity="0.12" strokeWidth="1" />
          <circle cx={safeXY.x} cy={safeXY.y} r="30" fill="#10b981" fillOpacity="0.07" />
          <text x={safeXY.x} y={safeXY.y + 3} fill="#a7f3d0" fontSize="7" fontWeight="black" textAnchor="middle" className="font-mono uppercase tracking-widest opacity-80">
            🛡 Patrol Zone
          </text>

          {/* Unwalked Full Route Guideline */}
          <polyline points={routePoints} fill="none" stroke="#475569" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4,4" opacity="0.6" />

          {/* Walked Path Segment (Cyan Glow) */}
          {active && walkedPoints && (
            <polyline 
              points={walkedPoints} 
              fill="none" 
              stroke={routePreference === "safe" ? "#06b6d4" : "#f43f5e"} 
              strokeWidth="5.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          )}

          {/* Active Guardians Nearby (Pink beacons) */}
          <g>
            <circle cx={guardian1.x} cy={guardian1.y} r={blink ? 5.5 : 4} fill="#ec4899" className="transition-all duration-300" />
            <circle cx={guardian1.x} cy={guardian1.y} r="12" fill="none" stroke="#ec4899" strokeWidth="1" strokeOpacity={blink ? 0.3 : 0.05} />
            <text x={guardian1.x} y={guardian1.y - 10} fill="#fbcfe8" fontSize="6.5" fontWeight="black" textAnchor="middle" className="font-mono bg-slate-950/90 px-1 py-0.5 rounded border border-pink-500/10">
              ANANYA (320m)
            </text>
          </g>

          <g>
            <circle cx={guardian2.x} cy={guardian2.y} r={blink ? 4 : 5.5} fill="#ec4899" className="transition-all duration-300" />
            <circle cx={guardian2.x} cy={guardian2.y} r="12" fill="none" stroke="#ec4899" strokeWidth="1" strokeOpacity={blink ? 0.05 : 0.3} />
            <text x={guardian2.x} y={guardian2.y + 12} fill="#fbcfe8" fontSize="6.5" fontWeight="black" textAnchor="middle" className="font-mono bg-slate-950/90 px-1 py-0.5 rounded border border-pink-500/10">
              MEERA (450m)
            </text>
          </g>

          {/* User Marker / Glowing Tracker Node */}
          <g>
            <circle cx={currentXY.x} cy={currentXY.y} r={blink ? 15 : 10} fill="#06b6d4" fillOpacity="0.2" className="transition-all duration-300" />
            <circle cx={currentXY.x} cy={currentXY.y} r="7" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" className="shadow-md" />
            <circle cx={currentXY.x} cy={currentXY.y} r="2.5" fill="#ffffff" />
          </g>
        </svg>

        {/* Info Box detailing key configuration */}
        <div className="absolute bottom-20 left-4 right-4 z-20 bg-slate-950/95 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl text-center shadow-lg">
          <p className="text-[8.5px] text-teal-400 font-extrabold uppercase tracking-wider">
            💡 Local Deployment Guide
          </p>
          <p className="text-[8px] text-slate-400 font-bold leading-normal mt-0.5">
            To render live real-world Google Maps coordinates, provide your key in <span className="text-teal-300 font-mono">VITE_GOOGLE_MAPS_API_KEY</span> inside your local <span className="text-slate-200 font-mono">.env</span> file.
          </p>
        </div>
      </div>
    );
  }

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

      {/* Live Guardian markers */}
      {liveGuardians.map((g) => (
        <MarkerF
          key={g.uid}
          position={{ lat: g.lat, lng: g.lng }}
          title={g.displayName || "Community Guardian"}
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
