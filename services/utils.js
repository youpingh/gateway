import config from '../config/google.js';
/**
 * Calls to the Google translae to get the pinyin of the Chinese text.
 * This is used by multiple services.
 * @param {*} text 
 * @returns 
 */
export async function getPinyin(text) {

  console.log('Getting pinyin of', text);
  const request = config.translateUrl + text;

  let pinyin = {
    status: true,
    text: text,
    pinyin: '',
    error: ''
  }

  try {
    const response = await fetch(request);
    const data = await response.json();
    let textPinyin = data[0].map(sentence => sentence[3]).join(" ");
    pinyin.status = true;
    pinyin.pinyin = textPinyin.trim();
  } catch (err) {
    pinyin.status = false;
    pinyin.error = 'Google translation failed: ' + err.message;
    console.error('Google translation failed: ', err.message);
  }
  console.log('Pinyin to return', pinyin);
  return pinyin;
}
