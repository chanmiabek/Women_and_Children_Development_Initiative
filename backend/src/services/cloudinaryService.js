import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';

function getCloudinary() {
  if (!config.cloudinaryUrl) {
    const error = new Error('Cloudinary is not configured. Set CLOUDINARY_URL.');
    error.status = 503;
    throw error;
  }
  const parsed = new URL(config.cloudinaryUrl);
  cloudinary.config({
    cloud_name: parsed.hostname,
    api_key: decodeURIComponent(parsed.username),
    api_secret: decodeURIComponent(parsed.password),
    secure: true
  });
  return cloudinary;
}

export function uploadImage(file) {
  return new Promise((resolve, reject) => {
    const stream = getCloudinary().uploader.upload_stream({ folder: 'wcdi/website', resource_type: 'image' }, (error, result) => {
      if (error) return reject(error);
      resolve({ secure_url: result.secure_url, public_id: result.public_id, width: result.width, height: result.height });
    });
    stream.end(file.buffer);
  });
}
