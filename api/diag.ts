import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const results: Record<string, string> = {};

  // Test 1: dynamic import mongodb
  try {
    const { MongoClient } = await import('mongodb');
    results.mongodb_import = 'OK';

    // Test 2: connect
    try {
      const uri = process.env.MONGODB_URI!;
      const client = new MongoClient(uri);
      await client.connect();
      const db = client.db(process.env.MONGODB_DB || 'driveflux');
      const pingResult = await db.command({ ping: 1 });
      results.mongodb_connect = pingResult.ok === 1 ? 'CONNECTED' : 'PING_FAILED';
      await client.close();
    } catch (e: any) {
      results.mongodb_connect = `ERROR: ${e.message}`;
    }
  } catch (e: any) {
    results.mongodb_import = `ERROR: ${e.message}`;
  }

  // Test 3: dynamic import cloudinary
  try {
    const cloudinary = await import('cloudinary');
    results.cloudinary_import = 'OK';
  } catch (e: any) {
    results.cloudinary_import = `ERROR: ${e.message}`;
  }

  return res.json({ node: process.version, results });
}
