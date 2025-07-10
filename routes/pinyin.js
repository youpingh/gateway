import express from 'express';
import { handlePinyin } from '../services/pinyinService.js';

const router = express.Router();

router.post('/', handlePinyin);

export default router;