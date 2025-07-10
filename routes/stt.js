import express from 'express';
import { handleSTT } from '../services/sttService.js';
import multer from 'multer';

const upload = multer(); // for parsing multipart/form-data
const router = express.Router();

router.post('/',  upload.single('file'), handleSTT);

export default router;