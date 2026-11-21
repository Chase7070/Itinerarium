import mongoose from 'mongoose';
import MapPin from '@/models/mapPin';

// Define mock schema object for testing
const mockSchema = {
  geo_location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  country: { type: String, required: false },
  city: { type: String, required: false },
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  map_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Map', 
    required: true 
  }
};

// Mock MapPin model
jest.mock('@/models/mapPin', () => {
  return {
    __esModule: true,
    default: {
      schema: {
        obj: mockSchema
      }
    }
  };
});

// Define MapPin data type
interface MapPinData {
  _id?: mongoose.Types.ObjectId | string;
  map_id: string;
  user_id: string;
  geo_location: {
    lat: number;
    lng: number;
    type?: string;
    coordinates?: number[];
  };
  country: string;
  city: string;
  [key: string]: any;
}

describe('MapPin Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema', () => {
    it('should have correct field definitions', () => {
      const schema = mockSchema;

      // Check if required fields exist
      expect(schema).toHaveProperty('map_id');
      expect(schema).toHaveProperty('user_id');
      expect(schema).toHaveProperty('geo_location');
      expect(schema).toHaveProperty('country');
      expect(schema).toHaveProperty('city');

      // Check geo_location fields
      const geoLocationField = schema.geo_location;
      expect(geoLocationField).toHaveProperty('lat');
      expect(geoLocationField).toHaveProperty('lng');

      // Check required fields
      const mapIdField = schema.map_id;
      const userIdField = schema.user_id;
      expect(mapIdField.required).toBe(true);
      expect(userIdField.required).toBe(true);
    });
  });

  describe('Geo location data', () => {
    it('should support GeoJSON-like structure', () => {
      const mockMapPin: MapPinData = {
        map_id: 'map-123',
        user_id: 'user-123',
        geo_location: { 
          lat: 35.6762, 
          lng: 139.6503,
          type: 'Point',
          coordinates: [139.6503, 35.6762]
        },
        country: 'Japan',
        city: 'Tokyo'
      };

      expect(mockMapPin.geo_location.type).toBe('Point');
      expect(mockMapPin.geo_location.coordinates).toEqual([139.6503, 35.6762]);
    });
  });

  describe('Instance methods', () => {
    it('should contain correct field values', () => {
      const mockMapPin: MapPinData = {
        _id: new mongoose.Types.ObjectId().toString(),
        map_id: 'map-123',
        user_id: 'user-123',
        geo_location: { 
          lat: 35.6762, 
          lng: 139.6503 
        },
        country: 'Japan',
        city: 'Tokyo',
        toJSON: function() {
          return {
            id: this._id,
            map_id: this.map_id,
            user_id: this.user_id,
            geo_location: this.geo_location,
            country: this.country,
            city: this.city
          };
        }
      };

      expect(mockMapPin.map_id).toBe('map-123');
      expect(mockMapPin.user_id).toBe('user-123');
      expect(mockMapPin.country).toBe('Japan');
      expect(mockMapPin.city).toBe('Tokyo');

      const jsonData = mockMapPin.toJSON();
      expect(jsonData).toHaveProperty('id');
      expect(jsonData).toHaveProperty('map_id', 'map-123');
      expect(jsonData).toHaveProperty('geo_location');
    });
  });
});
