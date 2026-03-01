import { useState } from "react";

const STYLES = [
  { id: "adventure", label: "⚔️ Epic Adventure", desc: "Heroes, quests, and triumphs" },
  { id: "fable", label: "🦊 Animal Fable", desc: "Wise creatures with lessons" },
  { id: "scifi", label: "🚀 Sci-Fi", desc: "Futuristic worlds and technology" },
  { id: "mystery", label: "🔍 Mystery", desc: "Clues, puzzles, and reveals" },
  { id: "fairytale", label: "✨ Fairy Tale", desc: "Magic, wonder, and enchantment" },
  { id: "comedy", label: "😄 Comedy", desc: "Witty and humorous narrative" },
];

const EXAMPLES = [
  "Machine Learning",
  "Blockchain",
  "Quantum Computing",
  "Neural Networks",
  "DNA Replication",
  "Black Holes"
];

export default function App() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("adventure");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    const selectedStyle = STYLES.find(s => s.id === style);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=your_api_key_here`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are a creative storyteller who explains technical concepts through engaging micro-stories.

Topic: "${topic}"
Storytelling Style: ${selectedStyle.label} — ${selectedStyle.desc}

Generate a response with EXACTLY this JSON structure (no markdown, no backticks, pure JSON):
{
  "title": "A creative story title",
  "story": "A 150-200 word engaging micro-story that embodies the concept through the chosen style.",
  "explanation": "A clear 2-3 sentence explanation of the actual technical concept.",
  "keyTakeaway": "One punchy sentence summarizing the core idea."
}`
                  }
                ]
              }
            ]
          })
        }
      );

      const data = await response.json();

      const text = data.candidates[0].content.parts[0].text;
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setResult(parsed);

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Georgia', serif",
      color: "#e8e0d0",
      padding: "48px 24px"
    }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
          ✦ The Knowledge Bard ✦
        </h1>

        <input
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="Enter a technical concept..."
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            marginBottom: "20px"
          }}
        />

        <div style={{ marginBottom: "20px" }}>
          {STYLES.map(s => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              style={{
                marginRight: "10px",
                marginBottom: "10px",
                padding: "8px 14px",
                cursor: "pointer",
                background: style === s.id ? "#f0b429" : "#333",
                color: "#fff",
                border: "none",
                borderRadius: "6px"
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={generate}
          disabled={loading}
          style={{
            padding: "12px 20px",
            background: "#f0b429",
            border: "none",
            cursor: "pointer",
            marginBottom: "30px"
          }}
        >
          {loading ? "Generating..." : "Generate Story"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        {result && (
          <div>
            <h2>{result.title}</h2>
            <p style={{ whiteSpace: "pre-wrap" }}>{result.story}</p>
            <h3>Explanation</h3>
            <p>{result.explanation}</p>
            <h3>Key Takeaway</h3>
            <p><em>{result.keyTakeaway}</em></p>
          </div>
        )}
      </div>
    </div>
  );
}