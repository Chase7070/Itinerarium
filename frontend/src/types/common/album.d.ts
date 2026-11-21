export interface JourneyAlbum {
    id: string;
    name: string;
    images: JourneyAlbumImage[];
    map_pin_id: string;
    map_id: string;
    user_id: string;
}

export interface JourneyAlbumImage {
    key: string;
}