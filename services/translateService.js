import config from '../config/openai.js';
/**
 * Calls to the OpenAI API to translate Chinese text into English.
 * This is much better than Google's translate service with 
 * much higher quality of translation and it is able to handle
 * much longer text (16k tokens).
 */
export async function handleTranslate(req, res) {
  console.log('Translating Chinese into English');
  const { messages } = req.body;

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
    console.log('Translation is done');
    res.json(data);
  } catch (err) {
    console.error('OpenAI translation failed, ', err.message);
    res.status(500).json({ error: 'OpenAI translation failed, ' + err.message });
  }
}
