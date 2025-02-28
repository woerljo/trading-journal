import * as jose from 'jose';

export const verifyToken = async (token) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (error) {
    console.error('Token Verifizierungsfehler:', error);
    throw new Error('Invalid token');
  }
}; 