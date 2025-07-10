import express from 'express';
import { handleTranslate } from '../services/translateService.js';

const router = express.Router();

router.post('/', handleTranslate);

export default router;