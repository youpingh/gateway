export default {
  get apiKey() { return process.env.OPENAI_API_KEY; },
  get ttsUrl() { return process.env.OPENAI_TTS_URL; },
  get sttUrl() { return process.env.OPENAI_STT_URL; },
  get translateUrl() { return process.env.OPENAI_TRANSLATE_URL; }
};