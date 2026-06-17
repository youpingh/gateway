import config from '../config/google.js';
/**
 * Calls to the Google translate to get the pinyin of the Chinese text.
 * This is used by multiple services.
 * @param {*} text 
 * @returns 
 */
export async function getTranslation(text) {

  console.log('Getting pinyin of', text);
  const request = config.translateUrl + text;

  let results = {
    text: text,
    pinyin: '',
    trans: '',
    alterTrans: [],
    status: false,
    error: `No translation for ${text}`
  }

  try {
    const response = await fetch(request);
    const data = await response.json();
    console.log('data:', data);
    if (data.sentences && data.sentences.length > 0) {
      const translation = toMultiSentenceCase(data.sentences[0].trans.trim());
      const textPinyin = data.sentences[1].src_translit.trim();
      results.pinyin = textPinyin;
      results.trans = translation;
      results.status = true;
      results.error = '';
      console.log('translation:', translation);
      console.log('textPinyin:', textPinyin);

      if (data.dict && data.dict.length > 0) {
        for (const dt of data.dict) {
          results.alterTrans.push({
            type: dt.pos,
            terms: dt.terms
          })
        }
      }
    }
  } catch (err) {
    results.status = false;
    results.error = 'Google translation failed: ' + err.message;
    console.error('Google translation failed: ', err.message);
  }
  // console.log('Pinyin to return', JSON.stringify(results, null, 2));
  console.log('Pinyin to return', results.text, results.pinyin, results.trans);

  return results;
}

function toMultiSentenceCase(str) {
  if (!str) return '';
  
  // 1. Lowercase the entire string first
  const lower = str.toLowerCase();
  
  // 2. Capitalize the first letter of each sentence
  return lower.replace(/(^\s*|[.!?]\s+)([a-z])/g, (match, separator, letter) => {
    return separator + letter.toUpperCase();
  });
}

/* The returned JSON object
  data: {
    sentences: [
      { trans: 'sky', orig: '天', backend: 10 },
      { src_translit: 'Tiān' }
    ],
    dict: [ // this may not exist for long sentence
      {
        pos: 'noun',
        terms: [Array],
        entry: [Array],
        base_form: '天',
        pos_enum: 1
      },
      {
        pos: 'adverb',
        terms: [Array],
        entry: [Array],
        base_form: '天',
        pos_enum: 4
      }
    ],
    src: 'zh-CN',
    confidence: 0,
    spell: {},
    ld_result: {
      srclangs: [ 'zh-CN' ],
      srclangs_confidences: [ 0 ],
      extended_srclangs: [ 'zh-CN' ]
    }
  }  
*/
