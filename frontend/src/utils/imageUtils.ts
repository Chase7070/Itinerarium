import { BASE_URL } from '@/api';

/**
 * Construct the image URL and ensure the correct concatenation of the BASE_URL and path
 * @param path image path
 * @param defaultImage default image path (used when path is empty)
 */
export const buildImageUrl = (path?: string | null, defaultImage: string = '/assets/default-avatar.png') => {
  if (!path) return defaultImage;
  if (path.startsWith('http')) return path; // if it's already a full URL, return it directly
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

/**
 * Get the user avatar URL
 * @param avatar user avatar path
 */
export const getUserAvatarUrl = (avatar?: string | null) => {
  return buildImageUrl(avatar);
};