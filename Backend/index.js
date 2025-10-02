// server/src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: true }));
app.use(express.json());

// -----------------------------
// In-memory Notes (no database)
// -----------------------------
let notes = [
  { id: 1, title: "Welcome", body: "This data is in-memory and resets on restart." }
];
let nextId = 2;

// Health
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "api", notes: notes.length });
});

// Notes: list
app.get("/api/notes", (_req, res) => {
  res.json(notes);
});

// Notes: create
app.post("/api/notes", (req, res) => {
  const { title, body } = req.body || {};
  if (!title) return res.status(400).json({ error: "title is required" });
  const note = { id: nextId++, title, body: body || "" };
  notes.unshift(note);
  res.status(201).json(note);
});

// Notes: update
app.put("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ error: "not found" });
  const { title, body } = req.body || {};
  notes[idx] = {
    ...notes[idx],
    title: title ?? notes[idx].title,
    body: body ?? notes[idx].body,
  };
  res.json(notes[idx]);
});

// Notes: delete
app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = notes.length;
  notes = notes.filter(n => n.id !== id);
  if (notes.length === before) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

// ------------------------------------
// Java & English learning (in-memory)
// ------------------------------------
const javaTips = [
  "Code to interfaces, not implementations.",
  "Prefer composition over inheritance.",
  "Use try-with-resources to close resources.",
  "Keep classes small and cohesive.",
  "Use Streams judiciously; keep code readable."
];

const javaQuiz = [
  { q: "What does 'final' mean for a variable?", a: "Cannot be reassigned" },
  { q: "Which collection doesn't allow duplicates?", a: "Set" },
  { q: "Default access modifier in Java?", a: "Package-private" }
];

const englishPhrases = [
  "Break the ice — start a conversation in a tense situation.",
  "Hit the books — begin studying.",
  "Call it a day — stop working on something.",
  "Under the weather — feeling sick.",
  "Rule of thumb — a general practical rule."
];

const englishQuiz = [
  { q: "Choose the correct: 'There/Their/They're going home.'", a: "They're" },
  { q: "Past of 'go'?", a: "Went" },
  { q: "Plural of 'analysis'?", a: "Analyses" }
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Java APIs
app.get("/api/java/tip", (_req, res) => {
  res.json({ type: "tip", data: pick(javaTips) });
});

app.get("/api/java/quiz", (_req, res) => {
  const item = pick(javaQuiz);
  res.json({ type: "quiz", question: item.q });
});

app.post("/api/java/quiz/answer", (req, res) => {
  const { question, answer } = req.body || {};
  const item = javaQuiz.find(x => x.q === question);
  if (!item) return res.status(400).json({ correct: false, message: "Unknown question" });
  const correct = String(answer || "").trim().toLowerCase() === item.a.toLowerCase();
  res.json({ correct, expected: item.a });
});

// English APIs
app.get("/api/english/phrase", (_req, res) => {
  res.json({ type: "phrase", data: pick(englishPhrases) });
});

app.get("/api/english/quiz", (_req, res) => {
  const item = pick(englishQuiz);
  res.json({ type: "quiz", question: item.q });
});

app.post("/api/english/quiz/answer", (req, res) => {
  const { question, answer } = req.body || {};
  const item = englishQuiz.find(x => x.q === question);
  if (!item) return res.status(400).json({ correct: false, message: "Unknown question" });
  const correct = String(answer || "").trim().toLowerCase() === item.a.toLowerCase();
  res.json({ correct, expected: item.a });
});

// 404 fallback (optional)
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
