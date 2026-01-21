import { GoogleGenerativeAI } from "@google/generative-ai";
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
    res.status(500).json({ error: error });
  }
});

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

export default app;

async function fetchAI(message) {
  const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "Roasting kodingan ini dengan bahasa Indonesia yang sangat pedas dan menyakitkan. Jangan kasih solusi atau saran, cukup caci maki dengan sindiran tajam dan hinaan menusuk. Buat pembuat kode ini merasa seperti hasil gabut tanpa otak, biar dia mikir ulang kenapa dulu milih belajar ngoding. Satu paragraf aja, tapi harus nyelekit kayak exception tengah malam—sadis, elegan, dan bikin malu buka VS Code lagi.",
  });

  const result = await model.generateContent(message);
  return result.response.text();
}
