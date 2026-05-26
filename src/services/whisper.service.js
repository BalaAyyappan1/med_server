const { OpenAI } = require('openai');
const fs = require('fs');

/**
 * Transcribes the audio file using Groq's free Whisper API.
 * 
 * @param {string} filePath - Absolute path to the audio file.
 * @returns {Promise<string>} The transcribed text.
 */
async function transcribeAudio(filePath) {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.trim() === "" || apiKey.includes("your_groq_key_here")) {
        throw new Error("GROQ_API_KEY is not set in the environment (.env file).");
    }

    // Connect to Groq using the OpenAI-compatible SDK interface
    const groq = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://api.groq.com/openai/v1"
    });

    const response = await groq.audio.transcriptions.create({
        file: fs.createReadStream(filePath),
        model: "whisper-large-v3", // Use Groq's high-quality Whisper model
    });

    return response.text;
}

module.exports = {
    transcribeAudio
};
