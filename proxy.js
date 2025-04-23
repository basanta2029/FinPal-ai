import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5050;

// ✅ Enable CORS for Netlify domain
app.use(cors({
  origin: "https://tangerine-otter-be47bd.netlify.app",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// ✅ Parse incoming JSON
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 100
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("🔴 Proxy error:", err);
    res.status(500).json({ error: "Something went wrong in proxy." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server is running at http://localhost:${PORT}`);
});