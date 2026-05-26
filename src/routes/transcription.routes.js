const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { transcribeAudioController, getTranscriptionsController } = require("../controllers/transcription.controller");

const router = express.Router();

// Define uploads directory in root of med_server
const uploadDir = path.resolve(__dirname, "../../uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        // Retain file extension or default to .m4a/.mp3
        let ext = path.extname(file.originalname);
        if (!ext) {
            // Default file extension for recordings if unspecified
            ext = ".m4a"; 
        }
        cb(null, `audio-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024 // 20 MB file size limit
    }
});

// POST /api/transcribe -> Upload single audio file with field name 'audio'
router.post("/transcribe", upload.single("audio"), transcribeAudioController);

// GET /api/transcriptions -> Get all stored transcriptions
router.get("/transcriptions", getTranscriptionsController);

module.exports = router;
