import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import { getDb } from '../_lib/mongodb';
import { setCors, isAdmin, methodNotAllowed } from '../_lib/helpers';
import { toJSON } from '../_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = await getDb();
  const col = db.collection('pricingPackages');
  const id = req.query.id as string | undefined;

  // Single-document operations when ?id= is provided
  if (id) {
    let oid: ObjectId;
    try { oid = new ObjectId(id); } catch { return res.status(400).json({ error: 'Invalid id' }); }

    if (req.method === 'GET') {
      const doc = await col.findOne({ _id: oid });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      return res.json(toJSON(doc));
    }
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    if (req.method === 'PUT') {
      const body = req.body; delete body._id; delete body.id;
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

  // Collection-level operations
  if (req.method === 'GET') {
    const filter: Record<string, unknown> = {};
    if (req.query.serviceType) filter.serviceTypeSlug = req.query.serviceType;
    if (req.query.active === 'true') filter.isActive = true;
    const docs = await col.find(filter).sort({ order: 1 }).toArray();
    return res.json(docs.map(toJSON));
  }

  if (req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    const body = req.body;
    const result = await col.insertOne(body);
    const inserted = await col.findOne({ _id: result.insertedId });
    return res.status(201).json(toJSON(inserted!));
  }

  return methodNotAllowed(res);
}
