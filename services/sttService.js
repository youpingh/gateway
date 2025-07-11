import config from '../config/google.js';
import { getPinyin } from './utils.js';

/**
 * Calls to the Google STT service to convert speech in Chinese to text. 
 * The Google's STT service is a little better than OpenAI's.
 */
export async function handleSTT(req, res) {

  console.log('Converting speech to text with Google STT');

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

  // create an HTTP request
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

  // post the request to Google STT service
  try {
    const url = config.sttUrl + config.apiKey;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google STT response is not ok, ', errorText);
      return res.status(500).json({ error: errorText });
    }

    const data = await response.json();

    // if the result is ok, get the pinyin of it
    if (data.results) {
      const text = data.results.map(result => result.alternatives[0].transcript).join(" ");
      const pinyin = await getPinyin(text);
      console.log('Converted text with pinyin:', pinyin);
      if (pinyin.status) {
        res.json(pinyin);
      } else {
        console.error('Error:', pinyin.error);
        res.status(500).json({ error: pinyin.error });
      }
    } else {
      console.error('Google STT Error:', "No speech detected.");
      res.status(500).json({ error: "No speech detected." });
    }
  } catch (error) {
    console.error('Google STT Transcribing audio failed:', error.errorText);
    res.status(500).json({ error: "Transcribing audio failed:" + error.errorText });
  }
}
