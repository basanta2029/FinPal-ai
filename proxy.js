import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer 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" // Your full key
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100
    }),
  });

  const data = await response.json();
  res.json(data);
});

app.listen(5050, () => {
  console.log("✅ Proxy server is running at http://localhost:5050");
});