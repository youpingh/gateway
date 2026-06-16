import { getTranslation } from './utils.js';

/**
 * Calls to the Google Translation service to get the English translation of a Chinese text. 
 */
export async function handleGoogleTranslate(req, res) {

  const results = await getTranslation(req.body.text);
  if (results.status) {
    res.json(results);
  } else {
    res.status(500).json({ error: results.error });
  }
}
