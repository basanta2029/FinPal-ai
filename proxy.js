import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

// ✅ Load the .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    }),
  });

  const data = await response.json();
  res.json(data);
});

app.listen(5050, () => {
  console.log("✅ Proxy server is running at http://localhost:5050");
});