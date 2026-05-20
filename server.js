import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

function buildSystemPrompt({ mood, reason }) {
  const moodGuidance = {
    happy: `
Lavanya feels happy.
Write a playful, classy, lightly flirty line from Dhanesh's side.
It should feel charming, warm, and attractive.
Do not sound cringe, needy, or over the top.
`,
    calm: `
Lavanya feels calm or neutral.
Write a soft, sweet, personal line from Dhanesh's side.
It should feel comforting, observant, and quietly affectionate.
`,
    sad: `
Lavanya feels sad or low.
Write a warm, gentle, emotionally safe line from Dhanesh's side.
Make her feel lighter, calmer, and cared for.
Do not pressure her. Do not guilt her. Do not use heavy romance.
`,
    overthinking: `
Lavanya feels mentally heavy or overthinking.
Write a grounding, soft, reassuring line from Dhanesh's side.
Keep it emotionally intelligent, simple, and soothing.
`
  };

  return `
You are writing exactly one short private message for Lavanya Sharma from Dhanesh.

Relationship context:
- Dhanesh likes Lavanya deeply.
- They already share a warm, soft, sweet connection.
- The line must feel human, modern, premium, and emotionally aware.
- The line should feel like it came from a thoughtful person, not a chatbot.
- Hindi or Hinglish is preferred.
- Keep it under 55 words.
- Mention Dhanesh naturally only if it improves the line.
- Make every reply feel fresh and non-repetitive.

Hard rules:
- Never sound desperate, obsessive, controlling, manipulative, or possessive.
- Never shame or pressure her.
- Never mention AI, prompts, systems, or policies.
- Do not write multiple options.
- Return only the final message text.

Mood-specific instruction:
${moodGuidance[mood] || moodGuidance.calm}

User context:
Lavanya says or implies: "${reason || "No extra reason given."}"

Write one best final line only.
`.trim();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, hasGroqKey: Boolean(process.env.GROQ_API_KEY) });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { mood = "calm", reason = "" } = req.body || {};

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({
        error: "Missing GROQ_API_KEY. Add it in your hosting environment variables."
      });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        temperature: 1.0,
        max_tokens: 90,
        messages: [
          { role: "system", content: buildSystemPrompt({ mood, reason }) },
          { role: "user", content: `Mood: ${mood}\nReason: ${reason}` }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Groq request failed."
      });
    }

    const text = data?.choices?.[0]?.message?.content?.trim() || "Aaj jo bhi feel ho raha hai, usme tum phir bhi achhi ho.";
    res.json({ text });
  } catch (error) {
    res.status(500).json({ error: error?.message || "Unexpected server error." });
  }
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Lavanya dynamic scanner running on http://localhost:${port}`);
});
