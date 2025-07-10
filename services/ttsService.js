import config from '../config/google.js';

/**
 * Calls to Google TTS service to convert text to speech. 
 * Google's TTS service is much better than OpenAI's.
 * The endpoint: host/tts
 */
export async function handleTTS(req, res) {

  const ttsUrl = config.ttsUrl + config.apiKey;
  console.log(JSON.stringify(req.body), ttsUrl);

  try {
    const response = await fetch(ttsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });
    console.log('Google TTS is done:', response.ok, response.statusText, response.type);

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(audioBuffer));
    } else {
      console.log('Google TTS response is not ok', response.statusText);
      res.status(500).json({ error: response.statusText });
    }
  } catch (error) {
    console.log('Google TTS failed, ', error.message);
    res.status(500).json({ error: error.message });
  }
}
