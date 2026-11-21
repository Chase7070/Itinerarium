import apiClient from './axiosConfig';
import { CreateMapPinRequest, CreateMapPinResponse, UpdateMapPinRequest, UpdateMapPinResponse, GetMapPinsResponse } from '@/types/api/index';

export const mapPinApi = {
  createMapPin: async (mapId: string, pinData: CreateMapPinRequest): Promise<CreateMapPinResponse> => {
    const response = await apiClient.post(`/maps/${mapId}/pins`, pinData);
    return response.data;
  },

  getMapPins: async (mapId: string): Promise<GetMapPinsResponse> => {
    const response = await apiClient.get(`/maps/${mapId}/pins`);
    return response.data;
  },

  updateMapPin: async (mapId: string, pinId: string, pinData: UpdateMapPinRequest): Promise<UpdateMapPinResponse> => {
    const response = await apiClient.put(`/maps/${mapId}/pins/${pinId}`, pinData);
    return response.data;
  },

  deleteMapPin: async (mapId: string, pinId: string) => {
    const response = await apiClient.delete(`/maps/${mapId}/pins/${pinId}`);
    return response.data;
  },

  getUserMapPins: async (): Promise<GetMapPinsResponse> => {
    const response = await apiClient.get('/map-pins');
    return response.data;
  }
};