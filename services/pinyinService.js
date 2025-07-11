import { getPinyin } from './utils.js';

/**
 * Calls to the Google Translation service to get pinyin of a Chinese text. 
 * Don't use its translation result, just use the pinyin part.
 */
export async function handlePinyin(req, res) {

  const pinyin = await getPinyin(req.body.text);
  if (pinyin.status) {
    res.json(pinyin);
  } else {
    res.status(500).json({ error: pinyin.error });
  }
}
