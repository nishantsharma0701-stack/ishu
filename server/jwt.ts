import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'the_gentlemen_fashion_luxury_secret_key_2026';

export function signToken(payload: any): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  
  const encodedHeader = Buffer.from(JSON.stringify(header))
    .toString('base64url');
  
  const encodedPayload = Buffer.from(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days expiration
  })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');
    
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

export function verifyToken(token: string): any | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [header, payload, signature] = parts;
    const computedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');
      
    if (signature !== computedSignature) return null;
    
    const decodedPayload = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf-8')
    );
    
    // Check expiration
    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    
    return decodedPayload;
  } catch (e) {
    return null;
  }
}

export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', 'salt_gentlemen_fashion_2026')
    .update(password)
    .digest('hex');
}
