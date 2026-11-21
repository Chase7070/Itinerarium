import { Share } from './share';

export interface Map {
    id: string;
    name: string;
    type: 'shareable' | 'default';
    description: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
    share: Share | null;
}