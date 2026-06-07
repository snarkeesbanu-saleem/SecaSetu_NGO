/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure Gemini API key exists or log gracefully (lazy check)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not defined. AI research features will be limited.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Server-side Gemini AI research endpoint
  app.post('/api/gemini/research', async (req, res) => {
    try {
      const { type, query, sector } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.status(503).json({
          error: "Gemini API client is not configured. Please supply a valid GEMINI_API_KEY.",
        });
      }

      if (type === 'scout') {
        // High quality structured data discovery
        const systemPrompt = `You are a professional NGO Research Assistant specializing in the non-profit sector of India. 
Your objective is to return a list of genuine, verified Indian NGOs that fit the user's focus sector, location, or search keyword.
Ensure the returned data has precise website URLs, correct headquarters, realistic initiatives, and insightful descriptions. 
Do not hallucinate fake URLs; if you do not know the exact URL, use a real general portal or double check facts.
Filter by Sector: "${sector || 'Any_Sector'}" if specified.`;

        const userPrompt = `Scout and discover up to 5 real Indian NGOs matching this query or interest: "${query}". Return the details in structured format.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              description: "A list of scouted Indian NGOs",
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING, description: "Official name of the NGO in India" },
                  website: { type: Type.STRING, description: "Official website URL (start with http/https)" },
                  sector: { type: Type.STRING, description: "Identify sector: 'Education', 'Animal Welfare', 'Women Empowerment', 'Healthcare', 'Environmental Conservation', or 'Other'" },
                  headquarters: { type: Type.STRING, description: "HQ City and State in India (e.g. 'Mumbai, Maharashtra' or 'New Delhi')" },
                  keyInitiatives: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING },
                    description: "2 to 3 major programs or initiatives of this NGO"
                  },
                  description: { type: Type.STRING, description: "A detailed 2-3 sentence overview of their foundational work and objective" },
                  establishedYear: { type: Type.STRING, description: "Establishment year if known" },
                  impactSummary: { type: Type.STRING, description: "Brief statistic or description of their real impact" }
                },
                required: ["name", "website", "sector", "headquarters", "keyInitiatives", "description"]
              }
            }
          }
        });

        const textResponse = response.text;
        if (!textResponse) {
          throw new Error("No response from Gemini");
        }

        const dataList = JSON.parse(textResponse.trim());
        return res.json({ success: true, type: 'scout', items: dataList });
      } else {
        // Chat mode: unstructured detailed research / strategy discussion
        const systemPrompt = `You are an expert on the Indian developmental and non-governmental sector. 
Help the researcher understand different NGOs, operational models, fundraising methodologies, impact metrics, or how to write research reports.
Provide structured, professional, yet easy-to-read markdown responses. If they ask about specific Indian NGOs, outline their name, website, sector, HQ, and key initiatives.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: query || "Explain the major challenges Indian NGOs face in animal welfare and education.",
          config: {
            systemInstruction: systemPrompt,
          }
        });

        return res.json({ success: true, type: 'chat', text: response.text });
      }

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        success: false,
        error: error.message || "An error occurred with the AI Research service.",
      });
    }
  });

  // Setup Vite development server or production static serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server", err);
});
