const ORS_API_BASE_URL = 'https://api.openrouteservice.org';
const ORS_API_KEY = process.env.NEXT_PUBLIC_ORS_API_KEY;

interface LocationSuggestion {
    name: string;
    country: string;
    coords: [number, number];
}

interface ReverseGeocodeResult {
    country: string;
}

/**
 * Fetch location suggestions based on user input.
 * @param input User input for location search.
 * @returns A list of location suggestions.
 */
export const fetchLocationSuggestions = async (input: string): Promise<LocationSuggestion[]> => {
    if (!input.trim() || input.length < 2) { return [] }

    try {
        const response = await fetch(
            `${ORS_API_BASE_URL}/geocode/autocomplete?api_key=${ORS_API_KEY}&text=${encodeURIComponent(input)}&size=5&lang=en`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch suggestions: ${response.status}`);
        }

        const data = await response.json();

        return data.features.map((feature: any) => ({
            name: feature.properties.name,
            country: feature.properties.country || 'Unknown',
            coords: [
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0],
            ] as [number, number],
        }));
    } catch (error) {
        console.error('Error fetching location suggestions:', error);
        throw error;
    }
};

/**
 * Fetch detailed location information based on user input.
 * @param input User input for location search.
 * @returns Detailed location information including coordinates and country.
 */
export const fetchLocationDetails = async (input: string): Promise<LocationSuggestion | null> => {
    if (!input.trim()) {
        throw new Error('Input cannot be empty');
    }

    try {
        const response = await fetch(
            `${ORS_API_BASE_URL}/geocode/search?api_key=${ORS_API_KEY}&text=${encodeURIComponent(input)}`
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch location details: ${response.status}`);
        }

        const data = await response.json();
        const feature = data.features?.[0];

        if (!feature) {
            return null;
        }

        return {
            name: feature.properties.name,
            country: feature.properties.country || 'Unknown',
            coords: [
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0],
            ] as [number, number],
        };
    } catch (error) {
        console.error('Error fetching location details:', error);
        throw error;
    }
};

/**
 * Perform a reverse geocoding request to get country information based on latitude and longitude.
 * @param lat Latitude of the location.
 * @param lng Longitude of the location.
 * @returns The country name or "Unknown" if not found.
 */
export const reverseGeocode = async (lat: number, lng: number): Promise<ReverseGeocodeResult> => {
    try {
        const response = await fetch(
            `${ORS_API_BASE_URL}/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${lng}&point.lat=${lat}&lang=en&size=1`
        );

        if (!response.ok) {
            console.warn(`Reverse geocoding failed with status: ${response.status}`);
            return { country: 'Unknown' };
        }

        const data = await response.json();
        const country = data.features?.[0]?.properties?.country || 'Unknown';

        return { country };
    } catch (error) {
        console.error('Error during reverse geocoding:', error);
        return { country: 'Unknown' };
    }
};