import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/mongodb';
import { setCors, isAdmin, methodNotAllowed } from '../_lib/helpers';
import { toJSON } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = await getDb();
  const col = db.collection('routes');

  // GET — lấy danh sách, hỗ trợ ?province=X
  if (req.method === 'GET') {
    const filter: Record<string, unknown> = {};
    if (req.query.province) filter.province = req.query.province;
    if (req.query.active === 'true') filter.isActive = true;
    const docs = await col.find(filter).sort({ province: 1, to: 1 }).toArray();
    return res.json(docs.map(toJSON));
  }

  // POST — tạo mới (admin)
  if (req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    const body = req.body;
    const result = await col.insertOne(body);
    const inserted = await col.findOne({ _id: result.insertedId });
    return res.status(201).json(toJSON(inserted!));
  }

  return methodNotAllowed(res);
}
