
export default {
    get apiKey() { return process.env.GOOGLE_API_KEY; },
    get ttsUrl() { return process.env.GOOGLE_TTS_URL; },
    get sttUrl() { return process.env.GOOGLE_STT_URL; },
    get translateUrl() { return process.env.GOOGLE_TRANSLATE_URL; }
};