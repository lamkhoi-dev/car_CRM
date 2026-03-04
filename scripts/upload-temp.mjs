/**
 * Script to upload all images from temp/ folder to Cloudinary
 * Run: node scripts/upload-temp.mjs
 */
import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, writeFileSync } from 'fs';
import { resolve, extname, basename } from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dpr6zwanv',
  api_key: process.env.CLOUDINARY_API_KEY || '638459429143781',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'EibeA0ej4VbNG2LzDrlIYU20vVk',
});

const TEMP_DIR = resolve(process.cwd(), 'temp');
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
const VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.webm'];

// Map z-photo filenames to vehicle groups:
// xe_E: z756541016419x + z756541016420x (interior/exterior set 1)
// xe_F: z756541016434x-z756541016435x (interior/exterior set 2)  
// gallery: z756541017997x (gallery shots)
function getFolder(file) {
  if (file.startsWith('xe_A')) return 'carCRM/vehicles/xe_A';
  if (file.startsWith('xe_B')) return 'carCRM/vehicles/xe_B';
  if (file.startsWith('blog_')) return 'carCRM/blog';
  if (file.startsWith('landingpage')) return 'carCRM/landing';
  // Already-uploaded xe_C group
  if (file.startsWith('z7565410145')) return 'carCRM/vehicles/xe_C';
  // xe_E group: z756541016419x and z756541016420x
  if (/^z756541016419[2-5]/.test(file) || /^z756541016420/.test(file)) return 'carCRM/vehicles/xe_E';
  // xe_F group: z756541016434x and z756541016435x
  if (/^z756541016434/.test(file) || /^z756541016435/.test(file)) return 'carCRM/vehicles/xe_F';
  // gallery/xe_G: z756541017997x
  if (file.startsWith('z756541017997')) return 'carCRM/vehicles/xe_G';
  return 'carCRM/general';
}

async function uploadAll() {
  const files = readdirSync(TEMP_DIR).sort();
  const results = {};

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const isImage = IMAGE_EXTS.includes(ext);
    const isVideo = VIDEO_EXTS.includes(ext);
    if (!isImage && !isVideo) continue;

    const folder = getFolder(file);

    // Skip xe_C images that were already uploaded earlier
    if (folder === 'carCRM/vehicles/xe_C') {
      console.log(`SKIP (already uploaded): ${file}`);
      continue;
    }

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
      results[file] = { url: result.secure_url, folder };
      console.log(`  ✓ ${result.secure_url}`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
      results[file] = { error: err.message };
    }
  }

  writeFileSync('scripts/upload-results.json', JSON.stringify(results, null, 2));
  console.log('\n=== RESULTS SAVED to scripts/upload-results.json ===\n');
}

uploadAll().catch(console.error);
