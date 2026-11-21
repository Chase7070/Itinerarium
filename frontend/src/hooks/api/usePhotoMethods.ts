import { useCallback, useState } from 'react';
import { usePhotoAlbum, Photo } from '@/contexts/map/PhotoAlbumContext';
import { useNotification } from '@/contexts/notification/NotificationContext';
import { useAsyncHandler } from '@/hooks/utils/useAsyncHandler';
import { uploadApi, BASE_URL } from '@/api/index';
import { UploadedFile } from "@/types/common/index";

export function usePhotoMethods() {
  const { addPhotosToAlbum, deletePhotosFromAlbum } = usePhotoAlbum();
  const { showNotification } = useNotification();
  const { handleAsync, isLoading: asyncLoading } = useAsyncHandler();

  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // method to get photo URL uniformly
  const getPhotoUrl = useCallback((photoKey: string): string => {
    if (!photoKey) return '';
    if (photoKey.startsWith('http')) return photoKey;

    // default format
    return `${BASE_URL}${photoKey}`;
  }, []);

  // complete logic to upload photos to album
  const uploadPhotosToAlbum = useCallback(async (
    albumId: string,
    files: FileList
  ): Promise<Photo[] | null> => {
    if (!files || files.length === 0 || !albumId) return null;

    // check file size (e.g. limit to 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const filesArray = Array.from(files);

    const oversizedFiles = filesArray.filter(file => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      showNotification(`${oversizedFiles.length} files exceed the size limit(5MB)`, 'error');
      return null;
    }

    return await handleAsync<Photo[] | null>(
      async () => {
        setUploading(true);

        try {
          // use correct scene type 'journey'
          const uploadResponse = await uploadApi.uploadMultipleFiles(Array.from(files), 'journey');
          console.log('Upload response:', uploadResponse);

          if (!uploadResponse || !uploadResponse.files) {
            throw new Error('upload response format is incorrect');
          }

          // handle upload response uniformly
          const photosToAdd = uploadResponse.files.map((file: UploadedFile) => ({
            id: file.path,         // use path as id
            key: file.path,        // use path as key
            url: getPhotoUrl(file.path),
            albumId: albumId,
            createdAt: new Date().toISOString()
          })) as Photo[];

          // add uploaded photos to album
          await addPhotosToAlbum(albumId, photosToAdd);

          return photosToAdd;
        } finally {
          setUploading(false);
        }
      },
      {
        successMessage: "photos uploaded successfully",
        errorMessage: "photos upload failed",
        onError: (error) => {
          console.error('upload detailed error:', error);
        }
      }
    );
  }, [addPhotosToAlbum, getPhotoUrl, handleAsync, showNotification]);

  // delete single photo
  const deletePhoto = useCallback(async (
    albumId: string,
    photoIdentifier: string
  ): Promise<boolean> => {
    if (!albumId || !photoIdentifier) return false;

    const result = await handleAsync(
      async () => {
        setIsDeleting(true);
        try {
          await deletePhotosFromAlbum(albumId, [photoIdentifier]);
          return true;
        } finally {
          setIsDeleting(false);
        }
      },
      {
        successMessage: "photo deleted successfully",
        errorMessage: "photo deletion failed"
      }
    );

    return result === true;
  }, [deletePhotosFromAlbum, handleAsync]);

  // delete multiple photos
  const deleteMultiplePhotos = useCallback(async (
    albumId: string,
    photoIdentifiers: string[]
  ): Promise<boolean> => {
    if (!albumId || !photoIdentifiers || photoIdentifiers.length === 0) return false;

    console.log('Starting deleteMultiplePhotos for album:', albumId);
    console.log('Photos to delete:', photoIdentifiers);

    // filter out temporary IDs, only keep valid identifiers
    const validPhotoIdentifiers = photoIdentifiers.filter(id => id && !id.startsWith('temp-'));

    if (validPhotoIdentifiers.length === 0) {
      console.error('No valid photo identifiers found for deletion');
      return false;
    }

    const result = await handleAsync(
      async () => {
        setIsDeleting(true);
        try {
          await deletePhotosFromAlbum(albumId, validPhotoIdentifiers);
          console.log('Delete API call completed');
          return true;
        } catch (error) {
          console.error('Error in deletePhotosFromAlbum:', error);
          throw error;
        } finally {
          setIsDeleting(false);
        }
      },
      {
        successMessage: `successfully deleted ${validPhotoIdentifiers.length} photos`,
        errorMessage: "photo deletion failed",
        onSuccess: () => {
          console.log('Delete operation completed successfully');
        },
        onError: (error) => {
          console.error('Detailed delete error:', error);
        }
      }
    );

    return result === true;
  }, [deletePhotosFromAlbum, handleAsync]);

  return {
    uploadPhotosToAlbum,
    deletePhoto,
    deleteMultiplePhotos,
    getPhotoUrl,
    uploading,
    isDeleting,
    isLoading: asyncLoading,
    setUploading
  };
}