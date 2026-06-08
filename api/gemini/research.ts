import { GoogleGenAI, Type } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS handles if needed
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { type, query, sector } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: "Gemini API client is not configured on Vercel. Please supply GEMINI_API_KEY as an environment variable in your Vercel Dashboard.",
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-vercel',
        },
      },
    });

    if (type === 'scout') {
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
      return res.status(200).json({ success: true, type: 'scout', items: dataList });
    } else {
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

      return res.status(200).json({ success: true, type: 'chat', text: response.text });
    }
  } catch (error: any) {
    console.error("Vercel Serverless Gemini Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "An error occurred with the AI Research service.",
    });
  }
}
