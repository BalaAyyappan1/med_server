// Initialize environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./config/db");
const transcriptionRoutes = require("./routes/transcription.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests (crucial for mobile/web flutter calls)
app.use(cors());

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded audio files statically
app.use("/uploads", express.static(path.resolve(__dirname, "../uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Bind transcription API routes
app.use("/api", transcriptionRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        error: err.message || "An unexpected error occurred on the server."
    });
});

// Verify MySQL connection and start the server
const promiseDb = db.promise();
promiseDb.query("SELECT 1")
    .then(() => {
        console.log("Database connection established successfully.");
        
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`API endpoints available at http://localhost:${PORT}/api`);
        });
    })
    .catch((err) => {
        console.error("CRITICAL ERROR: Failed to connect to MySQL database.");
        console.error("Make sure your database server is running and credentials in .env are correct.");
        console.error(err);
        process.exit(1);
    });
