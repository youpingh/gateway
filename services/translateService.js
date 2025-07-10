import config from '../config/openai.js';
/**
 * Calls to OpenAI API to translate Chinese text into English.
 * This is much better than Google's translate service with 
 * much higher quality of translation and it is able to handle
 * much longer text (16k tokens).
 * The endpoint: host/api/translate
 */
export async function handleTranslate(req, res) {
  const { messages } = req.body;
  // console.log('messages: ', messages);
  // console.log('translateUrl: ', process.env.OPENAI_TRANSLATE_URL, config.translateUrl);

  try {
    const response = await fetch(config.translateUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: req.body.model || 'gpt-3.5-turbo',
        messages: messages,
        temperature: req.body.temperature || 0.3
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log('OpenAI translation failed, ', err.message);
    res.status(500).json({ error: err.message });
  }
}
