/** State/UT → approximate center coordinates (lat, lng) for Google Maps */
export const STATE_COORDS: Record<string, { lat: number; lng: number }> = {
  "Andhra Pradesh": { lat: 15.9129, lng: 79.7400 },
  "Arunachal Pradesh": { lat: 27.1000, lng: 93.6167 },
  "Assam": { lat: 26.2000, lng: 92.9376 },
  "Bihar": { lat: 25.6093, lng: 85.1444 },
  "Chhattisgarh": { lat: 21.2787, lng: 81.8661 },
  "Goa": { lat: 15.4909, lng: 73.8278 },
  "Gujarat": { lat: 22.2587, lng: 71.1924 },
  "Haryana": { lat: 29.0588, lng: 76.0856 },
  "Himachal Pradesh": { lat: 31.1048, lng: 77.1734 },
  "Jharkhand": { lat: 23.6102, lng: 85.2799 },
  "Karnataka": { lat: 15.3173, lng: 75.7139 },
  "Kerala": { lat: 10.8505, lng: 76.2711 },
  "Madhya Pradesh": { lat: 22.9734, lng: 78.6569 },
  "Maharashtra": { lat: 19.7515, lng: 75.7139 },
  "Manipur": { lat: 24.6637, lng: 93.9063 },
  "Meghalaya": { lat: 25.4670, lng: 91.3662 },
  "Mizoram": { lat: 23.1645, lng: 92.9376 },
  "Nagaland": { lat: 26.1584, lng: 94.5624 },
  "Odisha": { lat: 20.9517, lng: 85.0985 },
  "Punjab": { lat: 31.1471, lng: 75.3412 },
  "Rajasthan": { lat: 27.0238, lng: 74.2179 },
  "Sikkim": { lat: 27.5330, lng: 88.5122 },
  "Tamil Nadu": { lat: 11.1271, lng: 78.6569 },
  "Telangana": { lat: 18.1124, lng: 79.0193 },
  "Tripura": { lat: 23.9408, lng: 91.9882 },
  "Uttar Pradesh": { lat: 26.8467, lng: 80.9462 },
  "Uttarakhand": { lat: 30.0668, lng: 79.0193 },
  "West Bengal": { lat: 22.9868, lng: 87.8550 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Chandigarh": { lat: 30.7333, lng: 76.7794 },
  "Puducherry": { lat: 11.9416, lng: 79.8083 },
  "Ladakh": { lat: 34.1526, lng: 77.5770 },
  "Jammu & Kashmir": { lat: 33.7782, lng: 76.5762 },
};

/** Default fallback — India approximate center */
export const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

/** Get map center from user's saved state in localStorage */
export function getMapCenterFromUser(): { lat: number; lng: number } {
  try {
    const raw = localStorage.getItem("astra_user");
    if (raw) {
      const data = JSON.parse(raw);
      const state = data.state as string;
      if (state && STATE_COORDS[state]) {
        return STATE_COORDS[state];
      }
    }
  } catch { /* fallback */ }
  return DEFAULT_CENTER;
}

/** Get zoom level based on state */
export function getZoomLevel(state: string): number {
  // Small states/UTs need higher zoom
  const smallStates = ["Delhi", "Chandigarh", "Goa", "Puducherry"];
  if (smallStates.includes(state)) return 11;
  return 8; // default for most states
}