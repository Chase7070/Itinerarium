import apiClient from './axiosConfig';
import { UpdateShareRequest, GetShareByCodeResponse } from '@/types/api/index';

export const shareApi = {
  updateMapSharing: async (mapId: string, updateShareRequest: UpdateShareRequest): Promise<GetShareByCodeResponse> => {
    const response = await apiClient.put(`/maps/${mapId}/share`, updateShareRequest);
    return response.data;
  },

  getShareByCode: async (code: string): Promise<GetShareByCodeResponse> => {
    const response = await apiClient.get(`/share/${code}`);
    return response.data;
  }
};