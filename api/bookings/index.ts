import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/mongodb';
import { toJSON } from '../_lib/types';
import { setCors, isAdmin, methodNotAllowed } from '../_lib/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDb();
    const col = db.collection('bookings');

    if (req.method === 'GET') {
      // Support ?deviceId=xxx to filter bookings by device
      const { deviceId } = req.query;
      const filter = deviceId ? { deviceId: String(deviceId) } : {};
      const docs = await col.find(filter).sort({ createdAt: -1 }).toArray();
      return res.json(docs.map(toJSON));
    }

    if (req.method === 'POST') {
      const { vehicleId, vehicleName, customerName, customerPhone, startDate, endDate, totalPrice, deviceId } = req.body;

      if (!vehicleId || !customerName || !customerPhone || !startDate || !endDate) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const doc = {
        vehicleId,
        vehicleName: vehicleName || '',
        customerName,
        customerPhone,
        startDate,
        endDate,
        status: 'pending' as const,
        totalPrice: Number(totalPrice) || 0,
        deviceId: deviceId || '',
        createdAt: new Date().toISOString(),
      };

      const result = await col.insertOne(doc);
      return res.status(201).json({ id: result.insertedId.toString(), ...doc });
    }

    return methodNotAllowed(res);
  } catch (err: any) {
    console.error('API /bookings error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
