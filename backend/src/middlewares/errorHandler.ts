import { Request, Response, NextFunction } from 'express';
import { ApiError, ApiErrorCode, ApiErrorReason } from '@/types/api';
import { ValidationError } from 'yup';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ApiError) {
        // Handle ApiError specifically
        res.status(err.getHttpStatus()).json(err.getResponse());
    }
    else if (err instanceof ValidationError) {
        res.status(400).json({
            code: ApiErrorCode.INVALID_ARGUMENT,
            reason: ApiErrorReason.INVALID_ARGUMENT,
            message: err.message,
        });
    } else {
        // Handle other unexpected errors
        console.error(err.stack);

        res.status(500).json({
            code: ApiErrorCode.INTERNAL_SERVER_ERROR,
            reason: ApiErrorReason.INTERNAL_SERVER_ERROR,
        });
    }
}