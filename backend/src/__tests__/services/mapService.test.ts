import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createMap, getUserMaps, updateMap, deleteMap, validateMapAccess } from '@/services/mapService';
import Map from '@/models/map';
import Share from '@/models/share';
import { User } from '@/models/user';
import { ApiError } from '@/types/api';

jest.mock('nanoid', () => ({
  customAlphabet: () => () => 'ABC12345', // predictable nanoid
}));

describe('mapService', () => {
  let mongoServer: MongoMemoryServer;
  let userId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Map.deleteMany({});
    await Share.deleteMany({});
    await User.deleteMany({});
    userId = new mongoose.Types.ObjectId();
    await User.create({ 
      _id: userId, 
      username: 'testuser', 
      email: 'test@example.com',
      password: 'password123'
    });
  });

  describe('createMap', () => {
    it('should create a new map and share', async () => {
      const data = { name: 'Test Map', description: 'A demo map' };
      const map = await createMap(userId.toString(), data);

      expect(map.name).toBe(data.name);
      expect(map.description).toBe(data.description);

      const share = await Share.findOne({ target_id: map._id });
      expect(share).toBeTruthy();
      expect(share?.code).toBe('ABC12345');
    });
  });

  describe('getUserMaps', () => {
    it('should return user maps and populate share info', async () => {
      const map = await createMap(userId.toString(), { name: 'User Map' });
      const maps = await getUserMaps(userId.toString());

      expect(maps.length).toBe(1);
      expect(maps[0].name).toBe('User Map');
      expect(maps[0].share?.code).toBe('ABC12345');
    });
  });

  describe('updateMap', () => {
    it('should update the map if owned by user', async () => {
      const map = await createMap(userId.toString(), { name: 'Original' });
      const updated = await updateMap(userId.toString(), (map._id as mongoose.Types.ObjectId).toString(), { name: 'Updated' });

      expect(updated.name).toBe('Updated');
    });

    it('should throw if map not found or not owned', async () => {
      await expect(
        updateMap(new mongoose.Types.ObjectId().toString(), new mongoose.Types.ObjectId().toString(), { name: 'fail' })
      ).rejects.toThrow(ApiError);
    });
  });

  describe('deleteMap', () => {
    it('should delete the map if owned and not default', async () => {
      const map = await createMap(userId.toString(), { name: 'ToDelete' });
      await deleteMap(userId.toString(), (map._id as mongoose.Types.ObjectId).toString());

      const found = await Map.findById(map._id);
      expect(found).toBeNull();
    });

    it('should throw if map is default type', async () => {
      const map = await Map.create({ name: 'Default', type: 'default', owner: userId });
      await expect(deleteMap(userId.toString(), (map._id as mongoose.Types.ObjectId).toString())).rejects.toThrow('Default maps cannot be deleted');
    });
  });

  describe('validateMapAccess', () => {
    it('should allow owner full access', async () => {
      const map = await createMap(userId.toString(), { name: 'AccessTest' });
      const access = await validateMapAccess((map._id as mongoose.Types.ObjectId).toString(), userId.toString());

      expect(access).toBe('write');
    });

    it('should allow public access with read permission', async () => {
      const map = await createMap(userId.toString(), { name: 'Public' });
      await Share.updateOne({ target_id: map._id }, { $set: { 'access.range': 'anyone' } });

      const anotherUserId = new mongoose.Types.ObjectId().toString();
      const access = await validateMapAccess((map._id as mongoose.Types.ObjectId).toString(), anotherUserId);

      expect(access).toBe('read');
    });

    it('should throw for unauthorized access', async () => {
      const map = await createMap(userId.toString(), { name: 'Private' });

      const anotherUserId = new mongoose.Types.ObjectId().toString();
      await expect(validateMapAccess((map._id as mongoose.Types.ObjectId).toString(), anotherUserId)).rejects.toThrow('You do not have access to this map');
    });
  });
});
