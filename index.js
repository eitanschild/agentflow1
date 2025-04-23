const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages;

    const response = await openai.chat.completions.create({
      model: "gpt-4", // or gpt-3.5-turbo
      messages: messages,
    });

    res.json(response.choices[0].message);
  } catch (err) {
    console.error("OpenAI error:", err.message);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
