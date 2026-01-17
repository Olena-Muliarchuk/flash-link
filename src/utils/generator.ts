import crypto from 'crypto';

export const generateShortCode = (length: number = 6): string => {
    return crypto.randomBytes(length).toString('base64url').substring(0, length);
};
