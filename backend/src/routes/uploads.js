import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/auth.js';
import { uploadImage } from '../services/cloudinaryService.js';

export const uploadsRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)) return callback(null, true);
    const error = new Error('Only JPEG, PNG, GIF, and WebP images are allowed.');
    error.status = 400;
    return callback(error);
  }
});

uploadsRouter.post('/uploads/image', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, message: 'An image file is required.' });
    if (!hasSupportedImageSignature(req.file.buffer)) {
      return res.status(400).json({ ok: false, message: 'The uploaded file is not a supported image.' });
    }
    const data = await uploadImage(req.file);
    res.status(201).json({ ok: true, message: 'Image uploaded to Cloudinary.', data });
  } catch (error) {
    next(error);
  }
});

function hasSupportedImageSignature(buffer) {
  return (
    (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) ||
    (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) ||
    (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.toString('ascii', 0, 6))) ||
    (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP')
  );
}
