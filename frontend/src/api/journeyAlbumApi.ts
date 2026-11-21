import apiClient from './axiosConfig';
import { CreateJourneyAlbumRequest, CreateJourneyAlbumResponse, GetJourneyAlbumResponse, GetJourneyAlbumsResponse, UpdateJourneyAlbumRequest } from '@/types/api/index';

export interface JourneyAlbumData {
  name: string;
  images: Array<{
    key: string;
    description?: string;
  }>;
  description?: string;
}

export const journeyAlbumApi = {
  createJourneyAlbum: async (mapId: string, pinId: string, albumData: CreateJourneyAlbumRequest): Promise<CreateJourneyAlbumResponse> => {
    const response = await apiClient.post(`/maps/${mapId}/pins/${pinId}/albums`, albumData);
    return response.data;
  },

  getJourneyAlbum: async (mapId: string, pinId: string, albumId: string): Promise<GetJourneyAlbumResponse> => {
    const response = await apiClient.get(`/maps/${mapId}/pins/${pinId}/albums/${albumId}`);
    return response.data;
  },

  getJourneyAlbums: async (mapId: string, pinId: string): Promise<GetJourneyAlbumsResponse> => {
    const response = await apiClient.get(`/maps/${mapId}/pins/${pinId}/albums`);
    return response.data;
  },

  updateJourneyAlbum: async (mapId: string, pinId: string, albumId: string, albumData: UpdateJourneyAlbumRequest): Promise<GetJourneyAlbumResponse> => {
    const response = await apiClient.put(`/maps/${mapId}/pins/${pinId}/albums/${albumId}`, albumData);
    return response.data;
  },

  deleteJourneyAlbum: async (mapId: string, pinId: string, albumId: string) => {
    const response = await apiClient.delete(`/maps/${mapId}/pins/${pinId}/albums/${albumId}`);
    return response.data;
  }
};