import mongoose from 'mongoose';
import JourneyAlbum from '@/models/journeyAlbum';

describe('JourneyAlbum Model', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema', () => {
    it('should have correct field definitions', () => {
      const schema = JourneyAlbum.schema.obj;

      // Check if required fields exist
      expect(schema).toHaveProperty('name');
      expect(schema).toHaveProperty('images');
      expect(schema).toHaveProperty('map_id');
      expect(schema).toHaveProperty('map_pin_id');
      expect(schema).toHaveProperty('user_id');

      // Use type assertions to avoid TypeScript errors
      const nameField = schema.name as any;
      const mapIdField = schema.map_id as any;
      const mapPinIdField = schema.map_pin_id as any;
      const userIdField = schema.user_id as any;

      // Check required properties
      expect(nameField.required).toBe(true);
      expect(mapIdField.required).toBe(true);
      expect(mapPinIdField.required).toBe(true);
      expect(userIdField.required).toBe(true);

      // Validate that images is an array
      expect(Array.isArray(schema.images)).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should validate the structure inside the images array', () => {
      // Create a valid album instance
      const validAlbum = new JourneyAlbum({
        name: 'Trip to Italy',
        images: [
          {
            key: 'image1.jpg',
          },
        ],
        map_id: new mongoose.Types.ObjectId(),
        map_pin_id: new mongoose.Types.ObjectId(),
        user_id: new mongoose.Types.ObjectId(),
      });

      // Validate structure (without calling actual .validate())
      expect(validAlbum).toBeDefined();
      expect(validAlbum.images[0]).toHaveProperty('key');
      expect(validAlbum.images).toHaveLength(1);
    });
  });

  describe('toJSON transformation', () => {
    it('should correctly transform _id to id', () => {
      const album = new JourneyAlbum({
        name: 'Test Album',
        images: [{ key: 'image1.jpg' }],
        map_id: new mongoose.Types.ObjectId(),
        map_pin_id: new mongoose.Types.ObjectId(),
        user_id: new mongoose.Types.ObjectId(),
      });

      const json = album.toJSON();

      // Check if _id is transformed to id and __v is removed
      expect(json).toHaveProperty('id');
      expect(json).not.toHaveProperty('_id');
      expect(json).not.toHaveProperty('__v');
    });
  });
});
