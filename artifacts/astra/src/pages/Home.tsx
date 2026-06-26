import { useState } from "react";
import { GoogleMap } from "@/components/GoogleMap";
import { useLocation } from "wouter";

interface Marker {
  position: { lat: number; lng: number };
  title: string;
  color: string;
}

export function Home() {
  const [, setLocation] = useLocation();
  const [center] = useState({ lat: 40.7128, lng: -74.0060 });

  const markers: Marker[] = [
    { position: { lat: 40.7128, lng: -74.0060 }, title: "Safe Zone", color: "#22c55e" },
    { position: { lat: 40.7200, lng: -74.0100 }, title: "Caution", color: "#eab308" },
    { position: { lat: 40.7150, lng: -74.0200 }, title: "Alert", color: "#ef4444" },
    { position: { lat: 40.7250, lng: -74.0050 }, title: "Safe Zone", color: "#22c55e" },
    { position: { lat: 40.7180, lng: -74.0150 }, title: "Alert", color: "#ef4444" },
  ];

  const safeCount = markers.filter(m => m.color === "#22c55e").length;
  const cautionCount = markers.filter(m => m.color === "#eab308").length;
  const alertCount = markers.filter(m => m.color === "#ef4444").length;

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Map takes full available space */}
      <div className="flex-1 relative min-h-0">
        <GoogleMap 
          center={center}
          zoom={14}
          markers={markers}
          className="w-full h-full"
        />
      </div>

      {/* Bottom overlay panel */}
      <div className="absolute bottom-16 left-0 right-0 pointer-events-none">
        <div className="mx-4 mb-2 pointer-events-auto">
          {/* Safety stats card */}
          <div className="bg-[#1e293b]/95 backdrop-blur-md rounded-2xl p-4 border border-slate-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider">Area Safety Now</h3>
              <span className="text-slate-400 text-xs">Tap zones on map</span>
            </div>
            
            <div className="flex justify-between mb-3">
              <div className="text-center">
                <div className="text-green-400 text-2xl font-bold">{safeCount}</div>
                <div className="text-slate-400 text-xs">Safe zones</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 text-2xl font-bold">{cautionCount}</div>
                <div className="text-slate-400 text-xs">Caution zones</div>
              </div>
              <div className="text-center">
                <div className="text-rose-400 text-2xl font-bold">{alertCount}</div>
                <div className="text-slate-400 text-xs">Alert zones</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-green-500" style={{ width: `${(safeCount / markers.length) * 100}%` }} />
              <div className="bg-yellow-500" style={{ width: `${(cautionCount / markers.length) * 100}%` }} />
              <div className="bg-rose-500" style={{ width: `${(alertCount / markers.length) * 100}%` }} />
            </div>

            <p className="text-slate-400 text-xs text-center">
              ⚠ Several alert zones — prefer safe routes
            </p>
          </div>

          {/* Start Walking button */}
          <button 
            onClick={() => setLocation("/walk")}
            className="w-full mt-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:from-rose-600 hover:to-rose-700 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Start Walking
          </button>

          {/* Last walk info */}
          <div className="flex items-center justify-between mt-3 px-2">
            <div className="text-slate-300 text-sm">
              <div>Last walk: Home → College</div>
              <div className="text-slate-500 text-xs">12 min · 3 guardians · Safe ✓</div>
            </div>
            <button 
              onClick={() => setLocation("/walk")}
              className="text-rose-400 text-sm font-medium hover:text-rose-300 transition-colors"
            >
              Again
            </button>
          </div>
        </div>
      </div>

      {/* Top header overlay */}
      <div className="absolute top-0 left-0 right-0 p-4 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <div>
            <h1 className="text-white text-2xl font-bold">Astra</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">2 guardians near you</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-slate-800/80 backdrop-blur-sm text-slate-300 px-3 py-2 rounded-xl text-sm border border-slate-700 hover:bg-slate-700 transition-colors">
              Hide
            </button>
            <button className="bg-slate-800/80 backdrop-blur-sm text-slate-300 p-2 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Safety pills */}
        <div className="flex gap-2 mt-3 pointer-events-auto">
          <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            {safeCount} Safe
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
            {cautionCount} Caution
          </div>
          <div className="bg-rose-500/20 border border-rose-500/30 text-rose-400 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
            {alertCount} Alert
          </div>
        </div>

        {/* Check-in timer recommendation */}
        <div className="mt-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-xl p-3 flex items-center gap-3 pointer-events-auto">
          <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </div>
          <span className="text-slate-300 text-sm">Check-in timer recommended after 9 PM</span>
        </div>
      </div>
    </div>
  );
}