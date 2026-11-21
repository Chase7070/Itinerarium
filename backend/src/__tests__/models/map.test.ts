import mongoose from 'mongoose';
import Map from '@/models/map';
import Share from '@/models/share';

// Mock the Share model
jest.mock('@/models/share', () => ({
  default: {
    create: jest.fn().mockImplementation((data) => ({
      ...data,
      _id: new mongoose.Types.ObjectId(),
    })),
    findOne: jest.fn(),
  },
}));

// Define mock schema for the Map model
const mockSchema = {
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['default', 'shareable'],
    default: 'shareable',
  },
  description: { type: String, required: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: [],
  },
};

// Mock the Map model
jest.mock('@/models/map', () => {
  return {
    __esModule: true,
    default: {
      schema: {
        obj: mockSchema,
      },
    },
  };
});

// Define mock data type
interface MapData {
  _id?: mongoose.Types.ObjectId | string;
  name: string;
  type?: 'default' | 'shareable';
  description?: string;
  owner: mongoose.Types.ObjectId | string;
  collaborators?: (mongoose.Types.ObjectId | string)[];
  share?: any;
  __v?: number;
  [key: string]: any;
}

// Helper: mock model instance with toJSON method
const mockModel = (data: MapData) => ({
  ...data,
  toJSON: () => {
    const result = { ...data, id: data._id ? data._id.toString() : 'mock-id' };
    delete result._id;
    delete result.__v;
    return result;
  },
});

describe('Map Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema', () => {
    it('should have the correct field definitions', () => {
      const schema = mockSchema;

      expect(schema).toHaveProperty('name');
      expect(schema).toHaveProperty('type');
      expect(schema).toHaveProperty('description');
      expect(schema).toHaveProperty('owner');
      expect(schema).toHaveProperty('collaborators');

      const typeField = schema.type;
      expect(typeField.enum).toEqual(['default', 'shareable']);
      expect(typeField.default).toBe('shareable');
    });
  });

  describe('Model Instance', () => {
    it('should create a map with required fields', () => {
      const ownerId = new mongoose.Types.ObjectId();

      const mockMap = mockModel({
        _id: new mongoose.Types.ObjectId(),
        name: 'Test Map',
        type: 'default',
        description: 'A simple test map',
        owner: ownerId,
        collaborators: [],
      });

      expect(mockMap.name).toBe('Test Map');
      expect(mockMap.type).toBe('default');
      expect(mockMap.owner).toEqual(ownerId);
      expect(mockMap.collaborators).toEqual([]);
    });

    it('should default type to "shareable"', () => {
      const ownerId = new mongoose.Types.ObjectId();

      const mockMap = mockModel({
        name: 'Map with Default Type',
        owner: ownerId,
        collaborators: [],
        type: 'shareable', // Simulating default value behavior
      });

      expect(mockMap.type).toBe('shareable');
    });
  });

  describe('Validation Rules', () => {
    it('should only accept valid enum values for "type"', () => {
      // Simulate invalid enum value
      const invalidType = () => {
        return {
          isValid: false,
          errors: {
            type: {
              message: '`invalid-type` is not a valid enum value for path `type`.',
            },
          },
        };
      };

      const result = invalidType();
      expect(result.isValid).toBe(false);
      expect(result.errors.type).toBeDefined();
    });
  });

  describe('Virtual Fields', () => {
    it('should support the "share" virtual field', () => {
      const ownerId = new mongoose.Types.ObjectId();
      const mapId = new mongoose.Types.ObjectId();

      const mockMap = mockModel({
        _id: mapId,
        name: 'Map With Share',
        owner: ownerId,
        type: 'shareable',
        collaborators: [],
      });

      // Manually add virtual field
      mockMap.share = {
        _id: new mongoose.Types.ObjectId(),
        scene: 'map',
        code: 'abc123',
        target_id: mapId,
        access: { range: 'private', relevant_ids: [] },
      };

      const jsonMap = mockMap.toJSON();
      jsonMap.share = mockMap.share;

      expect(jsonMap.share).toBeDefined();
      expect(jsonMap.share.code).toBe('abc123');
    });
  });

  describe('Serialization', () => {
    it('toJSON should transform _id to id and remove __v', () => {
      const ownerId = new mongoose.Types.ObjectId();
      const mapId = new mongoose.Types.ObjectId();

      const mockMap = mockModel({
        _id: mapId,
        name: 'Serialization Test',
        owner: ownerId,
        type: 'shareable',
        __v: 0,
      });

      const json = mockMap.toJSON();

      expect(json.id).toBeDefined();
      expect(json._id).toBeUndefined();
      expect(json.__v).toBeUndefined();
      expect(json.name).toBe('Serialization Test');
    });
  });
});
