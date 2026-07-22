import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment variables.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. AI Complaint Analysis
app.post("/api/analyze-complaint", async (req, res) => {
  try {
    const { type, label, description, locationName, timestamp } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Return structured fallback analysis if key missing
      return res.json({
        category: type || "General Incident",
        severity: "Medium",
        threatLevel: "Medium",
        recommendedAction: "Avoid unlit sections and stay on well-frequented paths.",
        safetyImpactScore: 15,
        summary: description || "Community safety report logged.",
      });
    }

    const prompt = `You are Astra AI Safety Engine. Analyze the following women's safety complaint reported by a user and extract structured risk intelligence.
Complaint Type: ${type} (${label})
Location: ${locationName}
Timestamp: ${timestamp}
Description: ${description || "No description provided."}

Evaluate the incident severity, potential threat level, impact on local safety score (0-30 scale reduction), and a concise actionable safety recommendation for pedestrians in that vicinity.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, description: "Normalized incident category" },
            severity: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
            threatLevel: { type: Type.STRING, description: "Low, Medium, High, or Critical" },
            recommendedAction: { type: Type.STRING, description: "Direct advice for pedestrians walking near this area" },
            safetyImpactScore: { type: Type.NUMBER, description: "Safety score reduction index (0-30)" },
            summary: { type: Type.STRING, description: "1-sentence executive summary of the safety risk" },
          },
          required: ["category", "severity", "threatLevel", "recommendedAction", "safetyImpactScore", "summary"],
        },
      },
    });

    const jsonText = response.text || "{}";
    const analysis = JSON.parse(jsonText);
    res.json(analysis);
  } catch (error: any) {
    console.error("Error analyzing complaint with Gemini:", error);
    res.status(500).json({
      error: "Failed to perform AI analysis",
      details: error?.message || "Internal server error",
    });
  }
});

// 3. AI Safety Assistant Q&A
app.post("/api/ai-assistant", async (req, res) => {
  try {
    const { message, complaints = [], userLocation = "Koramangala, Bengaluru" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        reply: "Astra AI Safety Assistant is active. Currently running in offline fallback mode. Stay aware of your surroundings and keep your emergency contacts updated.",
      });
    }

    const contextStr = complaints.length > 0
      ? `CURRENT LIVE COMPLAINT DATABASE (${complaints.length} records):\n` +
        complaints.map((c: any, i: number) => `[${i + 1}] Category: ${c.label} | Severity: ${c.severity} | Location: ${c.locationName} | Details: ${c.description}`).join("\n")
      : "CURRENT LIVE COMPLAINT DATABASE: 0 records. (Database is currently clean; no incidents reported).";

    const systemInstruction = `You are Astra's AI Personal Safety Companion, a compassionate, expert, and direct safety assistant for women walking outdoors.
User Location: ${userLocation}

${contextStr}

Guidelines:
1. Reference the real-time complaint database above to answer user queries accurately.
2. If there are 0 complaints, reassure the user that the area currently has no reported incidents, but offer general situational awareness tips.
3. If asking about a route or location, explain specific risks based on reported complaints (e.g., poor lighting, harassment spots) and suggest safer alternatives.
4. Keep answers concise, empathetic, and highly actionable (3-5 sentences max). Use bullet points if helpful.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in AI Safety Assistant:", error);
    res.status(500).json({ error: "Assistant service unavailable" });
  }
});

// 4. Safe Route AI Explanation
app.post("/api/route-analysis", async (req, res) => {
  try {
    const { origin, destination, complaints = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      if (complaints.length === 0) {
        return res.json({
          explanation: "No safety data available. Showing shortest available route.",
          hasThreats: false,
        });
      }
      return res.json({
        explanation: `Route calculated avoiding ${complaints.length} reported incident spots in the area.`,
        hasThreats: true,
      });
    }

    if (complaints.length === 0) {
      return res.json({
        explanation: "No safety data available in the system yet. Showing shortest available route with standard well-lit paths.",
        hasThreats: false,
      });
    }

    const prompt = `Evaluate walking routes from "${origin}" to "${destination}" given these nearby reported incidents:
${complaints.map((c: any) => `- ${c.label} (${c.severity}): ${c.locationName} - ${c.description}`).join("\n")}

Provide a clear 2-sentence explanation of WHY the safest route was chosen over the shortest route, specifying which incident hazards (e.g. unlit lanes, harassment spots) were bypassed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({
      explanation: response.text || "Safest route detour calculated to bypass active incident zones.",
      hasThreats: true,
    });
  } catch (error: any) {
    console.error("Error analyzing route:", error);
    res.status(500).json({ error: "Route analysis error" });
  }
});

// ==========================================
// SERVER BOOTSTRAP & VITE MIDDLEWARE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ASTRA Safety Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
