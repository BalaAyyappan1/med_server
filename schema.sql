-- SQL script to create the required table in MySQL
CREATE DATABASE IF NOT EXISTS pedantick_med;
USE pedantick_med;

CREATE TABLE IF NOT EXISTS transcriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    audio_file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
