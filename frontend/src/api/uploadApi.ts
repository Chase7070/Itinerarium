import apiClient from './axiosConfig';
import { AxiosResponse } from 'axios';
import { UploadFileResponse, UploadFilesResponse } from '@/types/api/index';

export const uploadApi = {

  uploadSingleFile: async (file: File, scene: string = 'journey') => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post<UploadFileResponse>(`/upload?scene=${scene}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  uploadMultipleFiles: async (files: File[], scene: string = 'journey') => {
    const formData = new FormData();
    files.forEach(file => { formData.append('files', file) });

    try {
      const response: AxiosResponse<UploadFilesResponse> = await apiClient.post<UploadFilesResponse>(
        `/upload/multiple?scene=${scene}`, formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      return response.data;
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error &&
        error.response && typeof error.response === 'object' && 'data' in error.response) {
      }
      throw error;
    }
  }
};