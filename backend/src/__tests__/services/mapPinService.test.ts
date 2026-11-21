import { 
  createMapPin, 
  getMapPinsByMapId, 
  updateMapPin, 
  deleteMapPin, 
  getUserMapPins 
} from '@/services/mapPinService';
import Map from '@/models/map';
import MapPin from '@/models/mapPin';
import { eventBus, EventTypes } from '@/events/eventBus';
import { ApiError } from '@/types/api';
import mongoose from 'mongoose';

// Mock models
jest.mock('@/models/map', () => ({
  find: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnThis()
  })
}));

jest.mock('@/models/mapPin', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

// Mock eventBus
jest.mock('@/events/eventBus', () => ({
  eventBus: {
    emit: jest.fn()
  },
  EventTypes: {
    PIN_CREATED: 'PIN_CREATED',
    PIN_UPDATED: 'PIN_UPDATED',
    PIN_DELETED: 'PIN_DELETED'
  }
}));

// Mock mongoose
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: jest.fn(id => id)
  }
}));

describe('MapPinService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMapPin', () => {
    it('should create a new map pin and emit event', async () => {
      // Arrange
      const mockData = {
        geo_location: {
          lat: 35.6762,
          lng: 139.6503
        },
        country: 'Japan',
        city: 'Tokyo'
      };
      const mockCreatedPin = {
        _id: 'pin-123',
        ...mockData,
        map_id: 'map-123',
        user_id: 'user-123'
      };
      (MapPin.create as jest.Mock).mockResolvedValue(mockCreatedPin);

      // Act
      const result = await createMapPin('map-123', 'user-123', mockData);

      // Assert
      expect(MapPin.create).toHaveBeenCalledWith({
        ...mockData,
        map_id: 'map-123',
        user_id: 'user-123'
      });
      expect(eventBus.emit).toHaveBeenCalledWith(
        EventTypes.PIN_CREATED, 
        { mapId: 'map-123', pin: mockCreatedPin }
      );
      expect(result).toEqual(mockCreatedPin);
    });
  });

  describe('getMapPinsByMapId', () => {
    it('should get all pins for a map', async () => {
      // Arrange
      const mockMapId = 'map-123';
      const mockPins = [
        { _id: 'pin-1', map_id: mockMapId, city: 'Tokyo' },
        { _id: 'pin-2', map_id: mockMapId, city: 'Kyoto' }
      ];
      (MapPin.find as jest.Mock).mockResolvedValue(mockPins);

      // Act
      const result = await getMapPinsByMapId(mockMapId);

      // Assert
      expect(MapPin.find).toHaveBeenCalled();
      expect(result).toEqual(mockPins);
    });
  });

  describe('updateMapPin', () => {
    it('should update a map pin and emit event', async () => {
      // Arrange
      const mockPinId = 'pin-123';
      const mockUpdates = { city: 'Updated City' };
      const mockUpdatedPin = {
        _id: mockPinId,
        map_id: { toString: () => 'map-123' },
        city: 'Updated City'
      };
      (MapPin.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockUpdatedPin);

      // Act
      const result = await updateMapPin(mockPinId, mockUpdates);

      // Assert
      expect(MapPin.findByIdAndUpdate).toHaveBeenCalledWith(mockPinId, mockUpdates, { new: true });
      expect(eventBus.emit).toHaveBeenCalledWith(
        EventTypes.PIN_UPDATED, 
        { mapId: 'map-123', pin: mockUpdatedPin }
      );
      expect(result).toEqual(mockUpdatedPin);
    });

    it('should throw error when pin not found for update', async () => {
      // Arrange
      (MapPin.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(updateMapPin('pin-123', { city: 'Updated City' }))
        .rejects
        .toThrow('Map pin not found');
    });
  });

  describe('deleteMapPin', () => {
    it('should delete a map pin and emit event', async () => {
      // Arrange
      const mockPinId = 'pin-123';
      const mockDeletedPin = {
        _id: mockPinId,
        map_id: { toString: () => 'map-123' },
        city: 'Tokyo'
      };
      (MapPin.findByIdAndDelete as jest.Mock).mockResolvedValue(mockDeletedPin);

      // Act
      const result = await deleteMapPin(mockPinId);

      // Assert
      expect(MapPin.findByIdAndDelete).toHaveBeenCalledWith(mockPinId);
      expect(eventBus.emit).toHaveBeenCalledWith(
        EventTypes.PIN_DELETED, 
        { mapId: 'map-123', pin: mockDeletedPin }
      );
      expect(result).toEqual(mockDeletedPin);
    });

    it('should throw error when pin not found for deletion', async () => {
      // Arrange
      (MapPin.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(deleteMapPin('pin-123'))
        .rejects
        .toThrow('Map pin not found');
    });
  });

  describe('getUserMapPins', () => {
    it('should get all pins for user maps', async () => {
      // Arrange
      const mockUserId = 'user-123';
      const mockMaps = [
        { _id: 'map-1', id: 'map-1' },
        { _id: 'map-2', id: 'map-2' }
      ];
      const mockPins = [
        { _id: 'pin-1', map_id: 'map-1', city: 'Tokyo' },
        { _id: 'pin-2', map_id: 'map-2', city: 'Kyoto' }
      ];
      
      (Map.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue(mockMaps)
      });
      (MapPin.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPins)
      });

      // Act
      const result = await getUserMapPins(mockUserId);

      // Assert
      expect(Map.find).toHaveBeenCalledWith({
        $or: [
          { owner: mockUserId },
          { collaborators: mockUserId }
        ]
      });
      expect(result).toEqual(mockPins);
    });

    it('should throw error when no maps found for user', async () => {
      // Arrange
      (Map.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue([])
      });

      // Act & Assert
      await expect(getUserMapPins('user-123'))
        .rejects
        .toThrow('No maps found for the user');
    });
  });
}); 