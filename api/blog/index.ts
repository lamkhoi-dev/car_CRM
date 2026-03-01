import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/mongodb';
import { toJSON } from '../_lib/types';
import { setCors, isAdmin, methodNotAllowed } from '../_lib/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const db = await getDb();
    const col = db.collection('blogPosts');

    if (req.method === 'GET') {
      const docs = await col.find({}).sort({ date: -1 }).toArray();
      return res.json(docs.map(toJSON));
    }

    if (req.method === 'POST') {
      if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

      const { title, excerpt, content, image, author, readTime, category } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const doc = {
        title,
        excerpt: excerpt || '',
        content,
        image: image || '',
        author: author || 'Admin',
        date: new Date().toISOString().split('T')[0],
        readTime: readTime || '5 min read',
        category: category || 'General',
      };

      const result = await col.insertOne(doc);
      return res.status(201).json({ id: result.insertedId.toString(), ...doc });
    }

    return methodNotAllowed(res);
  } catch (err: any) {
    console.error('API /blog error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
