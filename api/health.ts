import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/mongodb';
import { setCors } from './_lib/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const checks: Record<string, string> = {};

  // Check env vars
  checks.MONGODB_URI = process.env.MONGODB_URI ? 'SET' : 'MISSING';
  checks.MONGODB_DB = process.env.MONGODB_DB ? 'SET' : 'MISSING';
  checks.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING';
  checks.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING';
  checks.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING';
  checks.ADMIN_SECRET = process.env.ADMIN_SECRET ? 'SET' : 'MISSING';

  // Check MongoDB connection
  try {
    const db = await getDb();
    const result = await db.command({ ping: 1 });
    checks.mongodb = result.ok === 1 ? 'CONNECTED' : 'PING_FAILED';
  } catch (err: any) {
    checks.mongodb = `ERROR: ${err.message}`;
  }

  const allOk = !Object.values(checks).some(v => v === 'MISSING' || v.startsWith('ERROR'));

  return res.json({
    status: allOk ? 'healthy' : 'unhealthy',
    checks,
    timestamp: new Date().toISOString(),
  });
}
