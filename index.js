const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ 初始化 OpenAI 实例
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/", async (req, res) => {
  try {
    const messages = req.body?.messages;
    const text = messages?.[0]?.text;

    if (!text) {
      return res.status(400).json({ error: "Invalid input: text is missing." });
    }

    console.log("🔹 Received text:", text);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a language detector. Reply only with 'zh' for Chinese, 'en' for English, or 'km' for Khmer."
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    const language = response.choices?.[0]?.message?.content?.trim() || "unknown";
    console.log("✅ Detected language:", language);

    res.json({ metadata: { language } });
  } catch (err) {
    console.error("❌ Detection error:", err);
    res.status(500).json({ error: "Language detection failed." });
  }
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`✅ Language detection webhook running on port ${port}`);
});
