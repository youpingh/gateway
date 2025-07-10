
/**
 * This is a proxy server to call Google and OpenAI services/APIs
 * that require an APP key. The purpose of this proxy is to hide
 * all the API keys for the simple HTML/JavaScript applications to
 * avoid exposing their API keys (check in the code to an open
 * souce project, like GitHub).
 * 
 * The API keys are stored in the .env file and it is not checked in.
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import ttsRoutes from './routes/tts.js';
import sttRoutes from './routes/stt.js';
import pinyinRoutes from './routes/pinyin.js';
import translateRoutes from './routes/translate.js';
// import userRoutes from './routes/user.js';

dotenv.config();

// These 2 lines are needed to resolve __dirname with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// Feature-based routing
app.use('/tts', ttsRoutes);
app.use('/stt', sttRoutes);
app.use('/pinyin', pinyinRoutes);
app.use('/translate', translateRoutes);
// app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.use(express.static(path.join(__dirname, 'public')));
