import { jwtVerify, SignJWT } from 'jose';


//In a real applications you should use a secure secret key
if (!process.env.NEXT_PUBLIC_JWT_SECRET && process.env.NODE_ENV === 'development') {
  throw new Error('JWT_SECRET is not set in production environment');
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-256-bit-secure-secret-key-here'
);

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  try {
    // Remove any existing JWT claims to prevent conflicts
    const { iat, exp, ...cleanPayload } = payload;

    return new SignJWT(cleanPayload)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .setNotBefore(new Date()) 
      .sign(JWT_SECRET);
  } catch (error) {
    console.error('Error signing JWT:', error);
    throw new Error('Failed to create authentication token');
  }
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'], // Only allow HS256 algorithm
    });
    return payload as unknown as JWTPayload;
  } catch (error) {
    // Handle specific JWT verification errors
    if (error instanceof Error) {
      if (error.name === 'JWTExpired') {
        console.warn('JWT token expired');
      } else if (error.name === 'JWTMalformed') {
        console.warn('Malformed JWT token');
      } else {
        console.error('Error verifying JWT:', error);
      }
    }
    return null;
  }
}