const express = require("express");
const OpenAI = require("openai"); // ✅ 新版写法
require("dotenv").config();

const app = express();
app.use(express.json());

// ✅ 初始化 openai 实例（无 Configuration）
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/", async (req, res) => {
  const text = req.body?.messages?.[0]?.text || "";
  try {
    const response = await openai.chat.completions.create({  // ✅ 新写法
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a language detector. Reply only with 'zh' for Chinese, 'en' for English, or 'km' for Khmer." },
        { role: "user", content: text }
      ]
    });

    const language = response.choices[0].message.content.trim();
    res.json({ metadata: { language } });
  } catch (err) {
    console.error("Detection error:", err.message);
    res.status(500).send("Language detection failed");
  }
});

const port = process.env.PORT
app.listen(port, () => console.log("✅ Language detection webhook running on port", port));
