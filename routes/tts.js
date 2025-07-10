import express from 'express';
import { handleTTS } from '../services/ttsService.js';

const router = express.Router();

router.post('/', handleTTS);

export default router;