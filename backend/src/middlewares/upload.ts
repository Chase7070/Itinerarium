import { ApiError, ApiErrorCode, ApiErrorReason } from "@/types/api";
import config from "@/config/config";
import multer from 'multer';
import fs from 'fs';

// Configure storage with dynamic destination
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const scene = req.query.scene; // Get the scene value from the request query
        let uploadPath = '';

        // Determine the upload directory based on the scene
        switch (scene) {
            case 'profile':
            case 'post':
            case 'avatar':
            case 'journey':
                uploadPath = `${config.public_dir}/uploads/${scene}`;
                break;
            default:
                uploadPath = `${config.public_dir}/uploads/others`; // fallback
                break;
        }

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath); // Set the upload directory
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

// File filter with dynamic validation based on scene
const fileFilter = (req: any, file: any, cb: any) => {
    const scene = req.query.scene; // Get the scene value from the request query

    // Validate file type based on the scene
    switch (scene) {
        case 'profile':
        case 'avatar':
        case 'post':
        case 'journey':
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.UNSUPPORTED_FILE_TYPE), false); // Invalid file type
            }
            break;
        default:
            cb(new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.INVALID_ARGUMENT, "Parameter is invalid or missing."), false);
    }
};

// Multer configuration
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export const uploadSingle = upload.single('file'); // Single file upload
export const uploadMultiple = upload.array('files', 100); // Multiple file upload, limit to 100 files