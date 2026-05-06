const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); // Added for file routing
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// 1. SERVE FRONTEND: This tells Vercel to show your HTML on the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. AI CHAT ROUTE: Handles the logic for Gemini
app.post('/api/chat', async (req, res) => {
    const { message, aiType } = req.body;

    try {
        let reply = "";
        
        if (aiType === "gemini") {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`;
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: message }] }]
            });
            reply = response.data.candidates[0].content.parts[0].text;
        } 
        
        res.json({ reply: reply });
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "NexusMind: API error. Check Environment Variables!" });
    }
});

// IMPORTANT: No app.listen() here for Vercel
module.exports = app;
