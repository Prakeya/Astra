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
    // Elegant, interactive vector tactical radar map fallback when Google Maps JS API script fails
    const getXY = (pos: { lat: number; lng: number }) => {
      const latSpan = 0.008;
      const lngSpan = 0.008;
      const x = 200 + ((pos.lng - center.lng) / lngSpan) * 160;
      const y = 200 - ((pos.lat - center.lat) / latSpan) * 160;
      return { x: Math.max(25, Math.min(375, x)), y: Math.max(25, Math.min(375, y)) };
    };

    return (
      <div className={`relative w-full h-full bg-[#0f172a] rounded-3xl overflow-hidden select-none ${className}`}>
        {/* Cyberpunk Grid */}
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: `linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }} />

        <svg className="w-full h-full relative z-10" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
          {/* Main Diagonal Highway */}
          <line x1="20" y1="380" x2="380" y2="20" stroke="#1e293b" strokeWidth="16" strokeLinecap="round" />
          <line x1="20" y1="380" x2="380" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="5,5" opacity="0.6" />

          {/* Cross Streets */}
          <line x1="20" y1="200" x2="380" y2="200" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
          <line x1="200" y1="20" x2="200" y2="380" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />

          {/* Circular Safe Perimeter Bypass Road */}
          <circle cx="200" cy="200" r="120" fill="none" stroke="#1e293b" strokeWidth="8" strokeDasharray="10,6" opacity="0.4" />

          {/* Render markers */}
          {markers.map((m, idx) => {
            const { x, y } = getXY(m.position);
            const isUser = m.color === "#06b6d4";
            return (
              <g key={idx}>
                {/* Risk or safe glow aura */}
                {!isUser && (
                  <>
                    <circle cx={x} cy={y} r="45" fill={m.color} fillOpacity="0.1" />
                    <circle cx={x} cy={y} r="24" fill={m.color} fillOpacity="0.18" />
                  </>
                )}
                {isUser && (
                  <>
                    <circle cx={x} cy={y} r="35" fill="#06b6d4" fillOpacity="0.15" />
                    <circle cx={x} cy={y} r="18" fill="#06b6d4" fillOpacity="0.25" />
                  </>
                )}

                {/* Marker Dot */}
                <circle cx={x} cy={y} r={isUser ? 8 : 6} fill={m.color} stroke="#ffffff" strokeWidth={isUser ? 3 : 2} />

                {/* Label */}
                <text x={x} y={y - 12} fill="#ffffff" fontSize="8.5" fontWeight="900" textAnchor="middle" className="font-mono uppercase tracking-wider drop-shadow-md">
                  {m.title}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Tactical UI Overlay Badge */}
        <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-emerald-400 px-2.5 py-1 rounded-xl text-[8.5px] font-mono font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Astra Tactical Radar</span>
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