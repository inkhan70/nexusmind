const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// 1. SERVE FRONTEND: Directs Vercel to your index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. AI CHAT ROUTE: Handles API logic
app.post('/api/chat', async (req, res) => {
    const { message, aiType } = req.body;

    try {
        let reply = "";
        
        if (aiType === "gemini") {
            // Using gemini-pro for better stability on v1beta
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_KEY}`;
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: message }] }]
            });
            
            if (response.data.candidates && response.data.candidates[0].content) {
                reply = response.data.candidates[0].content.parts[0].text;
            } else {
                reply = "AI response was empty. Check your prompt.";
            }
        } 
        
        res.json({ reply: reply });
    } catch (error) {
        // Log errors specifically to Vercel Logs
        console.error("API Error Detail:", error.response ? JSON.stringify(error.response.data) : error.message);
        res.status(500).json({ error: "NexusMind Connection Error. Check Vercel Keys!" });
    }
});

// IMPORTANT: Do NOT use app.listen(). Vercel requires exporting the app.
module.exports = app;
