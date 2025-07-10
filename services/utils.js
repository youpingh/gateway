import config from '../config/google.js';
/**
 * Calls to Google translae to get the pinyin of the Chinese text.
 * @param {*} text 
 * @returns 
 */
export async function getPinyin(text) {

  const request = config.translateUrl + text;
  // console.log(text);

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
    console.log('pinyin:', textPinyin);
    pinyin.status = true;
    pinyin.pinyin = textPinyin.trim();
  } catch (err) {
    pinyin.status = false;
    pinyin.error = err.message;
    console.log('Google translation failed, ', err.message);
  }
  return pinyin;
}
