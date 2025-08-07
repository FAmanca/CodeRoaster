import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/fetch/ai", async (req, res) => {
  const message = req.body.message;

  try {
    const reply = await fetchAI(message);
    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "AI fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

async function fetchAI(message) {
  const openai = new OpenAI({
    baseURL: "https://api.akbxr.com/v1",
    apiKey: process.env.AI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Roasting kodingan ini dengan bahasa Indonesia yang sangat pedas dan menyakitkan. Jangan kasih solusi atau saran, cukup caci maki dengan sindiran tajam dan hinaan menusuk. Buat pembuat kode ini merasa seperti hasil gabut tanpa otak, biar dia mikir ulang kenapa dulu milih belajar ngoding. Satu paragraf aja, tapi harus nyelekit kayak exception tengah malam—sadis, elegan, dan bikin malu buka VS Code lagi.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    model: "auto",
  });

  return completion.choices[0].message.content;
}
