import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     description: Upload a file with a specific scene
 *     tags:
 *       - Upload
 *     parameters:
 *       - in: query
 *         name: scene
 *         schema:
 *           type: string
 *           enum: [profile, avatar, post, journey, others]
 *         description: The scene for the file upload
 *         example: profile
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to be uploaded
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 file:
 *                   type: object
 *                   properties:
 *                     originalName:
 *                       type: string
 *                       description: The original name of the uploaded file
 *                       example: example.jpg
 *                     filename:
 *                       type: string
 *                       description: The name of the file stored on the server
 *                       example: 12345-example.jpg
 *                     path:
 *                       type: string
 *                       description: The path to the uploaded file
 *                       example: /uploads/profile/12345-example.jpg
 *                     size:
 *                       type: integer
 *                       description: The size of the uploaded file in bytes
 *                       example: 204800
 *                     mimetype:
 *                       type: string
 *                       description: The MIME type of the uploaded file
 *                       example: image/jpeg
 *       400:
 *         description: No file uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 4000000
 *                 reason:
 *                   type: string
 *                   example: FileNotFound
 *                 message:
 *                   type: string
 *                   example: No file uploaded
 */
export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file = req.file;
    if (!file) {
      return next(new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.FILE_NOT_FOUND, 'No file uploaded'));
    }
    const scene = req.query.scene as string || 'others';
    // Just return the file path and metadata without DB operations
    res.status(200).json({
      file: {
        originalName: file.originalname,
        filename: file.filename,
        path: `/uploads/${scene}/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload multiple files
 *     description: Upload multiple files with a specific scene.
 *     tags:
 *       - Upload
 *     parameters:
 *       - in: query
 *         name: scene
 *         schema:
 *           type: string
 *           enum: [profile, avatar, post, journey, others]
 *         description: The scene for the file upload (e.g., profile, avatar, post).
 *         example: post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The files to be uploaded.
 *     responses:
 *       200:
 *         description: Files uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       originalName:
 *                         type: string
 *                         description: The original name of the uploaded file.
 *                         example: example.jpg
 *                       filename:
 *                         type: string
 *                         description: The name of the file stored on the server.
 *                         example: 12345-example.jpg
 *                       path:
 *                         type: string
 *                         description: The path to the uploaded file.
 *                         example: /uploads/post/12345-example.jpg
 *                       size:
 *                         type: integer
 *                         description: The size of the uploaded file in bytes.
 *                         example: 204800
 *                       mimetype:
 *                         type: string
 *                         description: The MIME type of the uploaded file.
 *                         example: image/jpeg
 *       400:
 *         description: No files uploaded or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 4000000
 *                 reason:
 *                   type: string
 *                   example: InvalidArgument
 *                 message:
 *                   type: string
 *                   example: No files uploaded
 */
export const uploadFiles = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.files || !Array.isArray(req.files)) {
    return next(new ApiError(ApiErrorCode.INVALID_ARGUMENT, ApiErrorReason.INVALID_ARGUMENT, 'No files uploaded'));
  }
  const scene = req.query.scene as string || 'others';

  const files = req.files.map((file: Express.Multer.File) => ({
    originalName: file.originalname,
    filename: file.filename,
    path: `/uploads/${scene}/${file.filename}`,
    size: file.size,
    mimetype: file.mimetype,
  }));

  res.status(200).json({
    files,
  });
};