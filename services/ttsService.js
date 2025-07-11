import config from '../config/google.js';

/**
 * Calls to the Google TTS service to convert text to speech. 
 * Google's TTS service is much better than OpenAI's.
 * The endpoint: host/tts
 */
export async function handleTTS(req, res) {

  console.log('Converting text to speech');
  const ttsUrl = config.ttsUrl + config.apiKey;
  let errorMessage = '';

  try {
    const response = await fetch(ttsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    });

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      console.log('Converted text to speech:', response.ok, response.statusText, response.type);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(audioBuffer));
    } else {
      errorMessage = 'Google TTS response is not ok: ' + response.statusText
      console.error(errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  } catch (error) {
    errorMessage = 'Google TTS failed: ' + error.message
    console.error(errorMessage);
    res.status(500).json({ error: errorMessage });
  }
}
