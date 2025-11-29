import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const SIGNING_KEY = process.env.SIGNING_KEY || ENCRYPTION_KEY;
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

export function encryptRTSPUrl(rtspUrl: string): string {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha256');
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(rtspUrl, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return salt.toString('hex') + ':' + iv.toString('hex') + ':' + tag.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt RTSP URL');
  }
}

export function decryptRTSPUrl(encryptedUrl: string): string {
  try {
    const parts = encryptedUrl.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted format');
    }
    
    const [saltHex, ivHex, tagHex, encrypted] = parts;
    const salt = Buffer.from(saltHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, salt, 100000, 32, 'sha256');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt RTSP URL');
  }
}

export function signRTSPUrl(rtspUrl: string, userId: string): string {
  const data = `${rtspUrl}:${userId}:${Date.now()}`;
  const signature = crypto
    .createHmac('sha256', SIGNING_KEY)
    .update(data)
    .digest('hex');
  return signature;
}

export function verifyRTSPUrlSignature(
  rtspUrl: string, 
  userId: string, 
  signature: string,
  timestamp: number
): boolean {
  const data = `${rtspUrl}:${userId}:${timestamp}`;
  const expectedSignature = crypto
    .createHmac('sha256', SIGNING_KEY)
    .update(data)
    .digest('hex');
  
  const age = Date.now() - timestamp;
  if (age > 3600000) {
    return false;
  }
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

export function validateRTSPUrl(url: string): { valid: boolean; error?: string } {
  try {
    const rtspRegex = /^rtsp[s]?:\/\/([^\/:]+)(?::(\d+))?(\/.*)?$/i;
    
    if (!rtspRegex.test(url)) {
      return { valid: false, error: 'Invalid RTSP URL format' };
    }
    
    const urlObj = new URL(url);
    
    if (!['rtsp:', 'rtsps:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'Protocol must be rtsp:// or rtsps://' };
    }
    
    if (!urlObj.hostname || urlObj.hostname.length === 0) {
      return { valid: false, error: 'Hostname is required' };
    }
    
    const suspiciousPatterns = [
      /localhost/i,
      /127\.0\.0\.1/,
      /0\.0\.0\.0/,
      /\.\./,
    ];
    
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        return { valid: false, error: 'URL contains suspicious patterns' };
      }
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'URL parsing failed' };
  }
}

export function hashRTSPUrl(rtspUrl: string): string {
  return crypto.createHash('sha256').update(rtspUrl).digest('hex');
}

