import { UploadedFile } from '@/types/common/upload';

export interface UploadFileResponse {
    file: UploadedFile;
}

export interface UploadFilesResponse {
    files: UploadedFile[];
}