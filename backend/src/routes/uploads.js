import { Router } from 'express';
import multer from 'multer';
import { requireAdmin } from '../middleware/auth.js';
import { uploadImage } from '../services/cloudinaryService.js';

export const uploadsRouter = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype.startsWith('image/')) return callback(null, true);
    const error = new Error('Only image files are allowed.');
    error.status = 400;
    return callback(error);
  }
});

uploadsRouter.post('/uploads/image', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, message: 'An image file is required.' });
    const data = await uploadImage(req.file);
    res.status(201).json({ ok: true, message: 'Image uploaded to Cloudinary.', data });
  } catch (error) {
    next(error);
  }
});
