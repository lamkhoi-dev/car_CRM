import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Helper: set CORS headers (cho phép local dev)
 */
export function setCors(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * Helper: check admin secret
 */
export function isAdmin(req: VercelRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return true; // Nếu chưa set secret thì cho qua (dev mode)
  const auth = req.headers.authorization;
  return auth === `Bearer ${secret}`;
}

/**
 * Helper: respond 405 Method Not Allowed
 */
export function methodNotAllowed(res: VercelResponse) {
  return res.status(405).json({ error: 'Method not allowed' });
}
