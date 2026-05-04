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
            const url = https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY};
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: message }] }]
            });
            reply = response.data.candidates[0].content.parts[0].text;
        } 
        // You can add logic for OpenAI or others here later
        
        res.json({ reply: reply });
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "The AI is having trouble thinking. check your .env key!" });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(🚀 NexusMind Shield Active! Running on http://localhost:${PORT}));