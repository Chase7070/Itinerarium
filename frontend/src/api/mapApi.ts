import apiClient from './axiosConfig';
import { CreateMapRequest, CreateMapResponse, UpdateMapRequest, UpdateMapResponse, GetUserMapsResponse } from '@/types/api/index';

export const mapApi = {
  createMap: async (mapData: CreateMapRequest): Promise<CreateMapResponse> => {
    const response = await apiClient.post('/maps', mapData);
    return response.data;
  },

  getUserMaps: async (): Promise<GetUserMapsResponse> => {
    const response = await apiClient.get('/maps');
    return response.data;
  },

  updateMap: async (mapId: string, mapData: UpdateMapRequest): Promise<UpdateMapResponse> => {
    const response = await apiClient.put(`/maps/${mapId}`, mapData);
    return response.data;
  },

  deleteMap: async (mapId: string) => {
    const response = await apiClient.delete(`/maps/${mapId}`);
    return response.data;
  }
};