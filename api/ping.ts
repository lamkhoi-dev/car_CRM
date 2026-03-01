import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  return res.json({
    ok: true,
    message: 'Serverless function is working!',
    node: process.version,
    env_check: {
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'MISSING',
      MONGODB_DB: process.env.MONGODB_DB ? 'SET' : 'MISSING',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'MISSING',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'MISSING',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'MISSING',
      ADMIN_SECRET: process.env.ADMIN_SECRET ? 'SET' : 'MISSING',
    },
    timestamp: new Date().toISOString(),
  });
}
