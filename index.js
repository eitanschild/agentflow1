const cors = require("cors");
const express = require("express");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Allow all incoming requests or restrict to frontend
app.use(cors({
  origin: "*",  // Make sure this matches your frontend URL
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

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

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a real estate AI assistant. When given a short property description, 
you must generate a full, rich listing. Expand on details, add emotional language, 
highlight lifestyle benefits, and sound persuasive
 return the following in JSON format:

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

// Ping route for quick testing
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Server listening on port
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 AgentFlow backend running on port ${port}`);
});
