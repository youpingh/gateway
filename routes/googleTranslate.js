import express from 'express';
import { handleGoogleTranslate } from '../services/googleTranslateService.js';

const router = express.Router();

router.post('/', handleGoogleTranslate);

export default router;