import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/mongodb';
import { toJSON } from '../_lib/types';
import { setCors, methodNotAllowed } from '../_lib/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return methodNotAllowed(res);

  try {
    const db = await getDb();
    const docs = await db.collection('testimonials').find({}).toArray();
    return res.json(docs.map(toJSON));
  } catch (err: any) {
    console.error('API /testimonials error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
