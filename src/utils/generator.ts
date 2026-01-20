import crypto from 'crypto';

/**
 * Generates a random URL-safe string of a specified length.
 *
 * @param length - The length of the string to generate. Defaults to 6.
 * @returns A random URL-safe string.
 */
export const generateShortCode = (length: number = 6): string => {
    return crypto.randomBytes(length).toString('base64url').substring(0, length);
};
