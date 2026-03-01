import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import { getDb } from '../_lib/mongodb';
import { toJSON } from '../_lib/types';
import { setCors, isAdmin, methodNotAllowed } from '../_lib/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id } = req.query;
  if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Invalid id' });

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(id);
  } catch {
    return res.status(400).json({ error: 'Invalid id format' });
  }

  try {
    const db = await getDb();
    const col = db.collection('bookings');

    if (req.method === 'GET') {
      const doc = await col.findOne({ _id: objectId });
      if (!doc) return res.status(404).json({ error: 'Booking not found' });
      return res.json(toJSON(doc));
    }

    if (req.method === 'PUT') {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

      const { status } = req.body;
      if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const result = await col.findOneAndUpdate(
        { _id: objectId },
        { $set: { status } },
        { returnDocument: 'after' }
      );

      if (!result) return res.status(404).json({ error: 'Booking not found' });
      return res.json(toJSON(result));
    }

    if (req.method === 'DELETE') {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
      const result = await col.deleteOne({ _id: objectId });
      if (result.deletedCount === 0) return res.status(404).json({ error: 'Booking not found' });
      return res.json({ success: true });
    }

    return methodNotAllowed(res);
  } catch (err: any) {
    console.error('API /bookings/[id] error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
