import type { VercelRequest, VercelResponse } from '@vercel/node';
import cloudinary from './_lib/cloudinary';
import { setCors, isAdmin } from './_lib/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { image, folder } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image data is required (base64 or URL)' });
    }

    const result = await cloudinary.uploader.upload(image, {
      folder: folder || 'carCRM/general',
      transformation: [
        { width: 1200, height: 800, crop: 'limit', quality: 'auto', format: 'webp' },
      ],
    });

    return res.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Upload failed' });
  }
}
