const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/chat', async (req, res) => {
    const { message, aiType } = req.body;

    try {
        let reply = "";
        
        if (aiType === "gemini") {
            // Note the backticks ` here:
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`;
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: message }] }]
            });
            reply = response.data.candidates[0].content.parts[0].text;
        } 
        
        res.json({ reply: reply });
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "The AI is having trouble. Check your Vercel Environment Variables!" });
    }
});

// IMPORTANT FOR VERCEL: Export the app instead of app.listen
module.exports = app;
