import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import { getDb } from '../_lib/mongodb';
import { setCors, isAdmin, methodNotAllowed } from '../_lib/helpers';
import { toJSON } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Missing id' });

  let oid: ObjectId;
  try { oid = new ObjectId(id); } catch { return res.status(400).json({ error: 'Invalid id' }); }

  const db = await getDb();
  const col = db.collection('routes');

  if (req.method === 'GET') {
    const doc = await col.findOne({ _id: oid });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(toJSON(doc));
  }

  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  if (req.method === 'PUT') {
    const body = req.body;
    delete body._id; delete body.id;
    await col.updateOne({ _id: oid }, { $set: body });
    const updated = await col.findOne({ _id: oid });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    return res.json(toJSON(updated));
  }

  if (req.method === 'DELETE') {
    const result = await col.deleteOne({ _id: oid });
    return res.json({ success: result.deletedCount === 1 });
  }

  return methodNotAllowed(res);
}
