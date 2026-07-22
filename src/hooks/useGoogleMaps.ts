import { useEffect, useRef, useState, useCallback } from "react";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let loadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  // Already loaded
  if ((window as any).google?.maps) {
    return Promise.resolve();
  }

  // Already loading
  if (loadPromise) {
    return loadPromise;
  }

  if (!API_KEY) {
    console.error("❌ VITE_GOOGLE_MAPS_API_KEY is missing in .env");
    loadPromise = Promise.reject(new Error("Google Maps API key is missing"));
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const callbackName = `__gmCallback_${Date.now()}`;

    // Set up callback BEFORE creating script
    (window as any)[callbackName] = () => {
      delete (window as any)[callbackName];
      resolve();
    };

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=${callbackName}&loading=async`;
    script.async = true;
    script.defer = true;

    script.onerror = () => {
      delete (window as any)[callbackName];
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}

export function useGoogleMaps() {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadGoogleMapsScript()
      .then(() => {
        if (!cancelled) setLoaded(true);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { loaded, error };
}