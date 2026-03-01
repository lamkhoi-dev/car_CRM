import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/mongodb';
import { toJSON } from '../_lib/types';
import { setCors, isAdmin, methodNotAllowed } from '../_lib/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const db = await getDb();
  const col = db.collection('vehicles');

  // GET /api/vehicles — lấy danh sách xe
  if (req.method === 'GET') {
    const docs = await col.find({}).toArray();
    return res.json(docs.map(toJSON));
  }

  // POST /api/vehicles — thêm xe (admin)
  if (req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

    const { name, type, description, pricePerDay, pricePerHour, images, features, seats, transmission, fuel, rating, available } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'Name and type are required' });
    }

    const doc = {
      name,
      type,
      description: description || '',
      pricePerDay: Number(pricePerDay) || 0,
      pricePerHour: Number(pricePerHour) || 0,
      images: images || [],
      features: features || [],
      seats: Number(seats) || 4,
      transmission: transmission || 'Automatic',
      fuel: fuel || 'Petrol',
      rating: Number(rating) || 0,
      available: available !== false,
    };

    const result = await col.insertOne(doc);
    return res.status(201).json({ id: result.insertedId.toString(), ...doc });
  }

  return methodNotAllowed(res);
}
