
import { GoogleGenAI, Type } from "@google/genai";
import { Organization, Country } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function findOrganizations(country: Country): Promise<{ organizations: Organization[]; sources: string[] }> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Find 5 prominent organizations in ${country} that provide digital literacy, online learning, or technology training programs. 
      For each, provide: name, country, city, type of program, current CEO or Director, and website link.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              country: { type: Type.STRING },
              city: { type: Type.STRING },
              programType: { type: Type.STRING },
              ceo: { type: Type.STRING },
              contact: { type: Type.STRING }
            },
            required: ["name", "country", "city", "programType", "ceo", "contact"]
          }
        }
      },
    });

    const orgs: Organization[] = JSON.parse(response.text || "[]").map((o: any) => ({
      ...o,
      id: Math.random().toString(36).substr(2, 9),
      country: country // Ensure it matches the type
    }));

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web?.uri)
      .filter((uri): uri is string => !!uri) || [];

    return { organizations: orgs, sources };
  } catch (error) {
    console.error("Failed to find organizations:", error);
    throw error;
  }
}

export async function getRegionalStats(country: Country): Promise<any> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Provide current estimated digital stats for ${country}: internet penetration (%), mobile phone usage (%), and youth population (approximate percentage under 25).`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          internet: { type: Type.NUMBER },
          mobile: { type: Type.NUMBER },
          youth: { type: Type.NUMBER }
        }
      }
    }
  });
  return JSON.parse(response.text || "{}");
}
