// src/api/index.ts
// Main export file to consolidate all API modules
export { default as apiClient, BASE_URL } from './axiosConfig';
export * from './userApi';
export * from './mapApi';
export * from './mapPinApi';
export * from './journeyAlbumApi';
export * from './uploadApi';
export * from './shareApi';