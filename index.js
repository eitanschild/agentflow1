const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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
    console.log("📨 New request received:");
    console.log(messages);

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a real estate AI assistant. When given a short property description, return the following in JSON format:

{
  "listing": "...",
  "caption": "...",
  "subject": "..."
}`,
        },
        ...messages,
      ],
    });

    res.json(response.choices[0].message);
  } catch (err) {
    console.error("❌ OpenAI Error:", err.response?.status || err.code || err.message);
    console.error("🔎 Full Error:", JSON.stringify(err, null, 2));

    res.status(500).json({
      error: {
        message: err.response?.data?.error?.message || err.message || "Something went wrong.",
      },
    });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 AgentFlow backend running on port ${port}`);
});
