export interface Pin {
    id: string;
    map_id: string;
    geo_location: {
        lat: number;
        lng: number;
    };
    country: string;
    city: string;
}