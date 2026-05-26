const db = require("../config/db");
const { transcribeAudio } = require("../services/whisper.service");
const path = require("path");

// Get the promise-based pool from mysql2
const promiseDb = db.promise();

/**
 * Handle audio file upload and transcribe it using Whisper.
 * Save the resulting transcription and file path to the DB.
 */
async function transcribeAudioController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No audio file uploaded." });
        }

        // Get file path relative to project for DB storage, and absolute path for transcription
        const absolutePath = req.file.path;
        const relativePath = `uploads/${req.file.filename}`;

        console.log(`Transcribing file: ${absolutePath}`);

        // Transcribe using Whisper service
        const transcribedText = await transcribeAudio(absolutePath);

        console.log(`Transcription result: "${transcribedText}"`);

        // Save to Database
        const query = "INSERT INTO transcriptions (text, audio_file_path) VALUES (?, ?)";
        const [result] = await promiseDb.query(query, [transcribedText, relativePath]);

        // Fetch the newly inserted record
        const selectQuery = "SELECT * FROM transcriptions WHERE id = ?";
        const [rows] = await promiseDb.query(selectQuery, [result.insertId]);

        return res.status(201).json({
            message: "Audio transcribed successfully.",
            data: rows[0]
        });
    } catch (error) {
        console.error("Error in transcribeAudioController:", error);
        return res.status(500).json({ error: "Internal Server Error during transcription." });
    }
}

/**
 * Fetch all past transcriptions from the DB sorted by created_at DESC.
 */
async function getTranscriptionsController(req, res) {
    try {
        const query = "SELECT * FROM transcriptions ORDER BY created_at DESC";
        const [rows] = await promiseDb.query(query);

        return res.status(200).json({
            data: rows
        });
    } catch (error) {
        console.error("Error in getTranscriptionsController:", error);
        return res.status(500).json({ error: "Internal Server Error fetching transcriptions." });
    }
}

module.exports = {
    transcribeAudioController,
    getTranscriptionsController
};
