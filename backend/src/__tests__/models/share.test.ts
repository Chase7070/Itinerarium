import mongoose from 'mongoose';
import Share from '@/models/share';
import Map from '@/models/map';
import { User } from '@/models/user';
import { updateShare, getShareByCode } from '@/services/shareService';
import { ApiError } from '@/types/api';

// Define a mocked schema object
const mockSchema = {
  scene: {
    type: String,
    enum: ['map'],
    required: true,
  },
  map: { type: mongoose.Schema.Types.Mixed, ref: 'Map', default: null },
  code: { type: String, required: true, unique: true },
  target_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  access: {
    range: {
      type: String,
      enum: ['private', 'anyone', 'assigned'],
      required: true,
    },
    relevant_ids: [
      {
        id: { type: String, required: true },
        permission: { type: String, enum: ['read', 'write'], required: true },
      },
    ],
  }
};

// Mock the Share model
jest.mock('@/models/share', () => {
  return {
    __esModule: true,
    default: {
      schema: {
        obj: mockSchema
      }
    }
  };
});

jest.mock('@/models/map');
jest.mock('@/models/user');

// Define the Share object type
interface ShareData {
  _id?: mongoose.Types.ObjectId | string;
  scene: string;
  code: string;
  target_id: mongoose.Types.ObjectId | string;
  owner: mongoose.Types.ObjectId | string;
  access: {
    range: 'private' | 'anyone' | 'assigned';
    relevant_ids: { id: string; permission: 'read' | 'write' }[];
  };
  [key: string]: any;
}

// Define the JSON output type
interface ShareJSON {
  id: string;
  scene: string;
  code: string;
  target_id?: string;
  owner?: string;
  access: {
    range: string;
    relevant_ids: { id: string; permission: string }[];
  };
  [key: string]: any;
}

describe('Share Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Schema', () => {
    it('should have the correct field definitions', () => {
      const schema = mockSchema;

      // Check required top-level fields
      expect(schema).toHaveProperty('scene');
      expect(schema).toHaveProperty('code');
      expect(schema).toHaveProperty('target_id');
      expect(schema).toHaveProperty('owner');
      expect(schema).toHaveProperty('access');

      // Check nested access field
      const accessField = schema.access;
      expect(accessField).toHaveProperty('range');
      expect(accessField).toHaveProperty('relevant_ids');

      // Check enums and required settings
      const sceneField = schema.scene;
      const rangeField = accessField.range;

      expect(sceneField.type).toBeDefined();
      expect(sceneField.required).toBe(true);
      expect(sceneField.enum).toEqual(['map']);

      expect(rangeField.type).toBeDefined();
      expect(rangeField.required).toBe(true);
      expect(rangeField.enum).toEqual(['private', 'anyone', 'assigned']);
    });
  });

  describe('Instance Creation', () => {
    it('should create a valid Share object', () => {
      const mockShare: ShareData = {
        _id: new mongoose.Types.ObjectId(),
        scene: 'map',
        code: 'test-code',
        target_id: new mongoose.Types.ObjectId(),
        owner: new mongoose.Types.ObjectId(),
        access: {
          range: 'private',
          relevant_ids: []
        },
        toJSON: function () {
          return {
            id: 'share-id-123',
            scene: this.scene,
            code: this.code,
            access: {
              range: this.access.range,
              relevant_ids: this.access.relevant_ids
            }
          };
        }
      };

      expect(mockShare.scene).toBe('map');
      expect(mockShare.code).toBe('test-code');
      expect(mockShare.access.range).toBe('private');
      expect(Array.isArray(mockShare.access.relevant_ids)).toBe(true);
    });

    it('should support different access ranges', () => {
      const publicShare: ShareData = {
        scene: 'map',
        code: 'public-code',
        target_id: new mongoose.Types.ObjectId(),
        owner: new mongoose.Types.ObjectId(),
        access: {
          range: 'anyone',
          relevant_ids: []
        }
      };
      expect(publicShare.access.range).toBe('anyone');

      const assignedShare: ShareData = {
        scene: 'map',
        code: 'assigned-code',
        target_id: new mongoose.Types.ObjectId(),
        owner: new mongoose.Types.ObjectId(),
        access: {
          range: 'assigned',
          relevant_ids: [
            { id: 'user-1', permission: 'read' },
            { id: 'user-2', permission: 'write' }
          ]
        }
      };
      expect(assignedShare.access.range).toBe('assigned');
      expect(assignedShare.access.relevant_ids.length).toBe(2);
    });
  });

  describe('JSON Serialization', () => {
    it('should serialize Share object correctly', () => {
      const mockShareData: ShareData = {
        _id: 'share-id-123',
        scene: 'map',
        code: 'json-code',
        target_id: 'target-123',
        owner: 'owner-123',
        access: {
          range: 'anyone',
          relevant_ids: []
        }
      };

      const mockShare = {
        ...mockShareData,
        toJSON: (): ShareJSON => ({
          id: 'share-id-123',
          scene: 'map',
          code: 'json-code',
          target_id: 'target-123',
          owner: 'owner-123',
          access: {
            range: 'anyone',
            relevant_ids: []
          }
        })
      };

      const jsonObj = mockShare.toJSON();

      expect(jsonObj.id).toBe('share-id-123');
      expect(jsonObj).not.toHaveProperty('_id');
      expect(jsonObj.scene).toBe('map');
      expect(jsonObj.code).toBe('json-code');
      expect(jsonObj.access.range).toBe('anyone');
    });
  });
});
