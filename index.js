const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config(); // local only — Railway injects env vars automatically

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 🧪 Log API key status (for Railway debugging)
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing!");
} else {
  console.log("✅ OPENAI_API_KEY is set:", process.env.OPENAI_API_KEY.slice(0, 10) + "...[redacted]");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  try {
    const messages = req.body.messages;

    const response = await openai.chat.completions.create({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: messages,
    });

    res.json(response.choices[0].message);
  } catch (err) {
    console.error("❌ OpenAI Error:", err); // Full error object
    res.status(500).json({ error: "OpenAI error occurred." });
  }
});

app.listen(port, () => {
  console.log(`🚀 AgentFlow backend running on port ${port}`);
});
