// Initialize environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const transcriptionRoutes = require("./routes/transcription.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use(cors());

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded audio files statically
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// Bind transcription API routes
app.use("/api", transcriptionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        error: err.message || "An unexpected error occurred on the server."
    });
});
