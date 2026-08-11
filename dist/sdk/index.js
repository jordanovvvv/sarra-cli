"use strict";
// src/sdk/index.ts
// This file should be exported from your Sarra package
// Users can then: import { sarra } from 'sarra'
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sarra = exports.geo = exports.crypto_utils = exports.id = void 0;
const crypto_1 = __importDefault(require("crypto"));
exports.id = {
    /**
     * Generate UUIDs (v4 or v7)
     * @example
     * const result = sarra.id.uuid({ version: 'v4', count: 5 });
     * console.log(result.uuids);
     */
    uuid(options = {}) {
        const { version = 'v4', count = 1 } = options;
        const uuids = [];
        for (let i = 0; i < count; i++) {
            if (version === 'v7') {
                uuids.push(uuidV7());
            }
            else {
                uuids.push(crypto_1.default.randomUUID());
            }
        }
        return { version, uuids };
    },
    /**
     * Generate cryptographically secure random tokens
     * @example
     * const result = sarra.id.random({ length: 32, count: 1 });
     * console.log(result.tokens[0]);
     */
    random(options = {}) {
        const { length = 16, count = 1 } = options;
        const tokens = [];
        for (let i = 0; i < count; i++) {
            tokens.push(crypto_1.default.randomBytes(length).toString('hex'));
        }
        return {
            tokens,
            count,
            length,
            encoding: 'hex',
        };
    },
};
// UUID v7 implementation
function uuidV7() {
    const timestamp = Date.now();
    const timestampHex = timestamp.toString(16).padStart(12, '0');
    const randomBytes = crypto_1.default.randomBytes(10);
    const randomHex = randomBytes.toString('hex');
    return `${timestampHex.slice(0, 8)}-${timestampHex.slice(8, 12)}-7${randomHex.slice(0, 3)}-${randomHex.slice(3, 7)}-${randomHex.slice(7)}`;
}
exports.crypto_utils = {
    /**
     * Generate cryptographic hash
     * @example
     * const hash = sarra.crypto.hash({ algorithm: 'sha256', input: 'hello' });
     */
    hash(options) {
        return crypto_1.default
            .createHash(options.algorithm)
            .update(options.input)
            .digest('hex');
    },
    /**
     * Base64 encode or decode
     * @example
     * const encoded = sarra.crypto.base64({ input: 'hello' });
     * const decoded = sarra.crypto.base64({ input: encoded, decode: true });
     */
    base64(options) {
        if (options.decode) {
            return Buffer.from(options.input, 'base64').toString('utf8');
        }
        return Buffer.from(options.input).toString('base64');
    },
    /**
     * AES-256-GCM encryption
     * @example
     * const result = sarra.crypto.aesEncrypt({ input: 'secret message' });
     * console.log(result.encrypted, result.key, result.iv, result.authTag);
     */
    aesEncrypt(options) {
        const key = options.key
            ? Buffer.from(options.key, 'hex')
            : crypto_1.default.randomBytes(32);
        const iv = crypto_1.default.randomBytes(16);
        const cipher = crypto_1.default.createCipheriv('aes-256-gcm', key, iv);
        let encrypted = cipher.update(options.input, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const authTag = cipher.getAuthTag();
        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex'),
            key: key.toString('hex'),
        };
    },
    /**
     * AES-256-GCM decryption
     * @example
     * const decrypted = sarra.crypto.aesDecrypt({
     *   encrypted: '...',
     *   key: '...',
     *   iv: '...',
     *   authTag: '...'
     * });
     */
    aesDecrypt(options) {
        const key = Buffer.from(options.key, 'hex');
        const iv = Buffer.from(options.iv, 'hex');
        const authTag = Buffer.from(options.authTag, 'hex');
        const decipher = crypto_1.default.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        let decrypted = decipher.update(options.encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    },
    /**
     * Generate RSA key pair
     * @example
     * const keys = sarra.crypto.rsaKeygen({ size: 4096 });
     * console.log(keys.publicKey, keys.privateKey);
     */
    rsaKeygen(options = {}) {
        const { size = 2048 } = options;
        const { publicKey, privateKey } = crypto_1.default.generateKeyPairSync('rsa', {
            modulusLength: size,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });
        return { publicKey, privateKey };
    },
    /**
     * RSA encrypt with public key
     * @example
     * const encrypted = sarra.crypto.rsaEncrypt({
     *   input: 'message',
     *   publicKey: '-----BEGIN PUBLIC KEY-----...'
     * });
     */
    rsaEncrypt(options) {
        const encrypted = crypto_1.default.publicEncrypt({
            key: options.publicKey,
            padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        }, Buffer.from(options.input));
        return encrypted.toString('base64');
    },
    /**
     * RSA decrypt with private key
     * @example
     * const decrypted = sarra.crypto.rsaDecrypt({
     *   encrypted: '...',
     *   privateKey: '-----BEGIN PRIVATE KEY-----...'
     * });
     */
    rsaDecrypt(options) {
        const decrypted = crypto_1.default.privateDecrypt({
            key: options.privateKey,
            padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        }, Buffer.from(options.encrypted, 'base64'));
        return decrypted.toString('utf8');
    },
};
exports.geo = {
    /**
     * Get your public IP address
     * @example
     * const ip = await sarra.geo.myIp();
     * console.log(ip.ip);
     */
    async myIp(ipv6 = false) {
        const endpoint = ipv6
            ? 'https://api64.ipify.org?format=json'
            : 'https://api.ipify.org?format=json';
        const response = await fetch(endpoint);
        if (!response.ok)
            throw new Error('Failed to fetch IP');
        return response.json();
    },
    /**
     * Lookup IP geolocation
     * @example
     * const data = await sarra.geo.lookup('8.8.8.8');
     * console.log(data.city, data.country_name);
     */
    async lookup(ip) {
        const endpoint = ip
            ? `https://ipapi.co/${ip}/json/`
            : 'https://ipapi.co/json/';
        const response = await fetch(endpoint);
        if (!response.ok)
            throw new Error('Failed to lookup IP');
        const data = await response.json();
        if (data.error) {
            throw new Error('Invalid IP address or lookup failed');
        }
        return data;
    },
    /**
     * Validate IP address (IPv4 or IPv6)
     * @example
     * const result = sarra.geo.validate('192.168.1.1');
     * console.log(result.valid, result.type);
     */
    validate(ip) {
        const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        const isIPv4 = ipv4Regex.test(ip);
        const isIPv6 = ipv6Regex.test(ip);
        const isValid = isIPv4 || isIPv6;
        return {
            ip,
            valid: isValid,
            type: isIPv4 ? 'IPv4' : isIPv6 ? 'IPv6' : null,
        };
    },
};
// ============================================
// DEFAULT EXPORT
// ============================================
exports.sarra = {
    id: exports.id,
    crypto: exports.crypto_utils,
    geo: exports.geo,
};
exports.default = exports.sarra;
