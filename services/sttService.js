import config from '../config/google.js';
import { getPinyin } from './utils.js';

/**
 * Calls to Google STT service to convert speech to text. 
 * Google's TTS service is a little better than OpenAI's.
 * The endpoint: host/stt
 */
export async function handleSTT(req, res) {
  if (!req.file) {
    console.log('No audio file uploaded');
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  const file = req.file;
  let encoding = 'WEBM_OPUS';
  switch (file.mimetype) {
    case 'audio/mpeg':
      encoding = 'MP3';
      break;
    case 'audio/mp4':
      encoding = 'MP4';
      break;
    case 'audio/webm':
    default:
      encoding = 'WEBM_OPUS';
      break;
  }
  // console.log('file:', file.originalname, file.mimetype, encoding);

  // const config = req.body;
  const request = {
    config: {
      encoding: encoding,
      sampleRateHertz: 48000,
      languageCode: "zh-CN",
      speechContexts: [
        {
          // to Chinese numbers instead of 0, 1, 2, ...
          phrases: ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
          boost: 20.0
        }
      ]
    },
    audio: {
      content: file.buffer.toString('base64')
    },
  };

  try {
    const url = config.sttUrl + config.apiKey;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Google STT response is not ok, ', errorText);
      return res.status(500).json({ error: errorText });
    }

    const data = await response.json();

    if (data.results) {
      const text = data.results.map(result => result.alternatives[0].transcript).join(" ");
      const pinyin = await getPinyin(text);
      // console.log(pinyin);
      if (pinyin.status) {
        res.json(pinyin);
      } else {
        console.log('Error:', pinyin.error);
        res.status(500).json({ error: pinyin.error });
      }
    } else {
      console.log('Google STT Error:', "No speech detected.");
      res.status(500).json({ error: "No speech detected." });
    }
  } catch (error) {
    console.log('Google STT Transcribing audio failed:', error.errorText);
    res.status(500).json({ error: "Transcribing audio failed:" + error.errorText });
  }
}
