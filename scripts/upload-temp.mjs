/**
 * Script to upload all images from temp/ folder to Cloudinary
 * Run: node scripts/upload-temp.mjs
 */
import { v2 as cloudinary } from 'cloudinary';
import { readdirSync } from 'fs';
import { resolve, extname, basename } from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpr6zwanv',
  api_key: process.env.CLOUDINARY_API_KEY || '638459429143781',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'EibeA0ej4VbNG2LzDrlIYU20vVk',
});

const TEMP_DIR = resolve(process.cwd(), 'temp');
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.webm'];

async function uploadAll() {
  const files = readdirSync(TEMP_DIR);
  const results = {};

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const isImage = IMAGE_EXTS.includes(ext);
    const isVideo = VIDEO_EXTS.includes(ext);
    if (!isImage && !isVideo) continue;

    // Determine folder based on filename prefix
    let folder = 'carCRM/general';
    if (file.startsWith('xe_A')) folder = 'carCRM/vehicles/xe_A';
    else if (file.startsWith('xe_B')) folder = 'carCRM/vehicles/xe_B';
    else if (file.startsWith('blog_')) folder = 'carCRM/blog';
    else if (file.startsWith('landingpage')) folder = 'carCRM/landing';
    else if (file.startsWith('z756541014')) folder = 'carCRM/vehicles/xe_C';
    else if (file.startsWith('z756541016')) folder = 'carCRM/vehicles/xe_C';
    else if (file.startsWith('z756541017')) folder = 'carCRM/vehicles/xe_D';

    const filePath = resolve(TEMP_DIR, file);
    const publicId = basename(file, ext).replace(/[^a-zA-Z0-9_-]/g, '_');

    console.log(`Uploading: ${file} -> ${folder}/${publicId}`);
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        public_id: publicId,
        resource_type: isVideo ? 'video' : 'image',
        overwrite: true,
      });
      results[file] = result.secure_url;
      console.log(`  ✓ ${result.secure_url}`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      results[file] = `ERROR: ${err.message}`;
    }
  }

  console.log('\n=== UPLOAD RESULTS ===\n');
  console.log(JSON.stringify(results, null, 2));
}

uploadAll().catch(console.error);
