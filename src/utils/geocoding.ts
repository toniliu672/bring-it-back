import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface GeocodingResult {
  lat: number;
  lon: number;
}

export async function getGeocoding(
  address: string
): Promise<GeocodingResult | null> {
  // Check cache first
  const cachedResult = localStorage.getItem(`geocode_${address}`);
  if (cachedResult) {
    return JSON.parse(cachedResult);
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${GOOGLE_MAPS_API_KEY}`
    );

    console.log("Respons API Geocoding:", response.data);

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry.location;
      const result = { lat, lon: lng };

      console.log("Hasil geocoding:", result);

      // Cache the result
      localStorage.setItem(`geocode_${address}`, JSON.stringify(result));

      return result;
    }
    console.log("Tidak ada hasil geocoding yang valid");
    return null;
  } catch (error) {
    console.error("Error fetching geocoding data:", error);
    return null;
  }
}
