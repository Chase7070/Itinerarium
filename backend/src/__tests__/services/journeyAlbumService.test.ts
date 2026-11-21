import { 
  getJourneyAlbumById, 
  createJourneyAlbum, 
  updateJourneyAlbum, 
  deleteJourneyAlbum, 
  getAllJourneyAlbums 
} from '@/services/journeyAlbumService';
import JourneyAlbum from '@/models/journeyAlbum';
import { eventBus, EventTypes } from '@/events/eventBus';
import { ApiError } from '@/types/api';

// Mock JourneyAlbum model
jest.mock('@/models/journeyAlbum', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findOneAndDelete: jest.fn(),
  find: jest.fn()
}));

// Mock eventBus
jest.mock('@/events/eventBus', () => ({
  eventBus: {
    emit: jest.fn()
  },
  EventTypes: {
    ALBUM_CREATED: 'ALBUM_CREATED',
    ALBUM_UPDATED: 'ALBUM_UPDATED',
    ALBUM_DELETED: 'ALBUM_DELETED'
  }
}));

describe('JourneyAlbumService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getJourneyAlbumById', () => {
    it('should get album by id and user id', async () => {
      // Arrange
      const mockAlbum = { 
        _id: 'album-123', 
        name: 'Test Album',
        user_id: 'user-123' 
      };
      (JourneyAlbum.findOne as jest.Mock).mockResolvedValue(mockAlbum);

      // Act
      const result = await getJourneyAlbumById('album-123', 'user-123');

      // Assert
      expect(JourneyAlbum.findOne).toHaveBeenCalledWith({
        _id: 'album-123',
        user_id: 'user-123'
      });
      expect(result).toEqual(mockAlbum);
    });

    it('should throw error when album not found', async () => {
      // Arrange
      (JourneyAlbum.findOne as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(getJourneyAlbumById('album-123', 'user-123'))
        .rejects
        .toThrow('Journey album not found');
    });
  });

  describe('createJourneyAlbum', () => {
    it('should create a new album and emit event', async () => {
      // Arrange
      const mockData = { name: 'New Album', images: [] };
      const mockCreatedAlbum = {
        _id: 'album-456',
        name: 'New Album', 
        images: [],
        map_id: 'map-123',
        map_pin_id: 'pin-123',
        user_id: 'user-123'
      };
      (JourneyAlbum.create as jest.Mock).mockResolvedValue(mockCreatedAlbum);

      // Act
      const result = await createJourneyAlbum('map-123', 'pin-123', 'user-123', mockData);

      // Assert
      expect(JourneyAlbum.create).toHaveBeenCalledWith({
        ...mockData,
        map_id: 'map-123',
        map_pin_id: 'pin-123',
        user_id: 'user-123'
      });
      expect(eventBus.emit).toHaveBeenCalledWith(
        EventTypes.ALBUM_CREATED, 
        { mapId: 'map-123', mapPinId: 'pin-123', album: mockCreatedAlbum }
      );
      expect(result).toEqual(mockCreatedAlbum);
    });
  });

  describe('updateJourneyAlbum', () => {
    it('should update album and emit event', async () => {
      // Arrange
      const mockUpdates = { name: 'Updated Album' };
      const mockUpdatedAlbum = {
        _id: 'album-789',
        name: 'Updated Album',
        map_id: { toString: () => 'map-123' },
        map_pin_id: 'pin-123'
      };
      (JourneyAlbum.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedAlbum);

      // Act
      const result = await updateJourneyAlbum('album-789', mockUpdates);

      // Assert
      expect(JourneyAlbum.findByIdAndUpdate).toHaveBeenCalledWith('album-789', mockUpdates, { new: true });
      expect(eventBus.emit).toHaveBeenCalledWith(
        EventTypes.ALBUM_UPDATED, 
        { mapId: 'map-123', mapPinId: 'pin-123', album: mockUpdatedAlbum }
      );
      expect(result).toEqual(mockUpdatedAlbum);
    });

    it('should throw error when album not found for update', async () => {
      // Arrange
      (JourneyAlbum.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(updateJourneyAlbum('album-789', { name: 'Updated Album' }))
        .rejects
        .toThrow('Album not found');
    });
  });

  describe('deleteJourneyAlbum', () => {
    it('should delete album and emit event', async () => {
      // Arrange
      const mockDeletedAlbum = {
        _id: 'album-123',
        name: 'Album to Delete',
        map_id: { toString: () => 'map-123' },
        map_pin_id: 'pin-123'
      };
      (JourneyAlbum.findOneAndDelete as jest.Mock).mockResolvedValue(mockDeletedAlbum);

      // Act
      const result = await deleteJourneyAlbum('album-123', 'user-123');

      // Assert
      expect(JourneyAlbum.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'album-123',
        user_id: 'user-123'
      });
      expect(eventBus.emit).toHaveBeenCalledWith(
        EventTypes.ALBUM_DELETED, 
        { mapId: 'map-123', mapPinId: 'pin-123', journeyAlbum: mockDeletedAlbum }
      );
      expect(result).toEqual(mockDeletedAlbum);
    });

    it('should throw error when album not found for deletion', async () => {
      // Arrange
      (JourneyAlbum.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(deleteJourneyAlbum('album-123', 'user-123'))
        .rejects
        .toThrow('Journey album not found');
    });
  });

  describe('getAllJourneyAlbums', () => {
    it('should get all albums for a map pin', async () => {
      // Arrange
      const mockAlbums = [
        { _id: 'album-1', name: 'Album 1', map_pin_id: 'pin-123' },
        { _id: 'album-2', name: 'Album 2', map_pin_id: 'pin-123' }
      ];
      (JourneyAlbum.find as jest.Mock).mockResolvedValue(mockAlbums);

      // Act
      const result = await getAllJourneyAlbums('pin-123');

      // Assert
      expect(JourneyAlbum.find).toHaveBeenCalledWith({ map_pin_id: 'pin-123' });
      expect(result).toEqual(mockAlbums);
    });

    it('should return empty array when no albums found', async () => {
      // Arrange
      (JourneyAlbum.find as jest.Mock).mockResolvedValue([]);

      // Act
      const result = await getAllJourneyAlbums('pin-123');

      // Assert
      expect(JourneyAlbum.find).toHaveBeenCalledWith({ map_pin_id: 'pin-123' });
      expect(result).toEqual([]);
    });
  });
}); 