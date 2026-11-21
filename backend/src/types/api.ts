export enum ApiErrorCode {
    INVALID_ARGUMENT = 4000000,
    UNAUTHORIZED = 4010000,
    FORBIDDEN = 4030000,
    NOT_FOUND = 4040000,
    INTERNAL_SERVER_ERROR = 5000000,
}

export enum ApiErrorReason {
    INVALID_ARGUMENT = 'InvalidArgument',
    INVALID_CREDENTIALS = 'InvalidCredentials',
    AUTHENTICATION_FAILED = 'AuthenticationFailed',
    ACCESS_DENIED = 'AccessDenied',
    RESOURCE_NOT_FOUND = 'ResourceNotFound',
    DATA_EXISTED = 'DataExisted',
    FILE_NOT_FOUND = 'FileNotFound',
    UNSUPPORTED_FILE_TYPE = 'UnsupportedFileType',
    INTERNAL_SERVER_ERROR = 'InternalServerError',
}

export class ApiError extends Error {
    private code: ApiErrorCode;
    private reason: ApiErrorReason;

    constructor(code: ApiErrorCode, reason: ApiErrorReason, message: string = '') {
        super(message); // Call the parent class constructor
        this.code = code;
        this.reason = reason;
        // Set the prototype explicitly (required for custom Error classes in TypeScript)
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    // Static method to map error codes to HTTP status codes
    public getHttpStatus(): number {
        const codeString = this.code.toString(); // Convert code to string
        const statusCode = parseInt(codeString.slice(0, 3), 10); // Extract the first 3 digits
        return statusCode;
    }

    public getResponse(): object {
        return {
            code: this.code,
            reason: this.reason,
            message: this.message,
        };
    }
}