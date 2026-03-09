import { GoogleGenAI, Type } from '@google/genai';
import { jsonrepair } from 'jsonrepair';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function safeParseJSON(text: string, fallback: any) {
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn('JSON parse error, attempting repair...', error);
    try {
      const repaired = jsonrepair(text);
      return JSON.parse(repaired);
    } catch (repairError) {
      console.error('JSON repair failed:', repairError);
      return fallback;
    }
  }
}

export async function reorganizeDocument(file: File | null, text: string, language: string) {
  const parts: any[] = [];
  
  if (file) {
    // Convert file to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // result is like "data:application/pdf;base64,JVBERi..."
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    parts.push({
      inlineData: {
        data: base64,
        mimeType: file.type || 'application/octet-stream',
      },
    });
  }
  
  if (text) {
    parts.push({ text });
  }
  
  parts.push({
    text: `Reorganize the provided medical device premarket review guidance or 510(k) summary into a comprehensive, well-structured markdown document. Ensure all key facts, dates, and regulatory requirements are preserved. Output language should be ${language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English'}.`
  });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
  });

  return response.text;
}

export async function generateTopics(markdown: string, language: string) {
  const prompt = `Based on the following medical device regulatory document, extract exactly 30 topics/entities/concepts and generate a complete set of 30 infographic specs.
  Output language: ${language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English'}.
  IMPORTANT: Keep descriptions, summaries, and takeaways concise to ensure the response fits within output token limits.
  
  Document:
  ${markdown}
  
  Return a JSON array of 30 objects, each with:
  - id: string (01-30)
  - title: string
  - summary: string
  - type: string (one of: 'timeline', 'flowchart', 'comparison', 'checklist', 'swimlane', 'layered', 'myth_fact', 'bar_chart', 'pie_chart')
  - data: array of objects (e.g., { label: string, value: string/number, description: string })
  - takeaways: array of strings (3-6 key points)
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            type: { type: Type.STRING },
            data: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                  description: { type: Type.STRING },
                }
              }
            },
            takeaways: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ['id', 'title', 'summary', 'type', 'data', 'takeaways']
        }
      }
    }
  });

  return safeParseJSON(response.text || '', []);
}

export async function generateChecklist(markdown: string, language: string) {
  const prompt = `Based on the following medical device regulatory document, create a comprehensive 100-item review checklist.
  Output language: ${language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English'}.
  IMPORTANT: Keep items concise to ensure the response fits within output token limits.
  
  Document:
  ${markdown}
  
  Return a JSON array of 100 strings representing the checklist items.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return safeParseJSON(response.text || '', []);
}

export async function generateQuestions(markdown: string, language: string) {
  const prompt = `Based on the following medical device regulatory document, generate 20 comprehensive follow-up questions for further review or clarification.
  Output language: ${language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English'}.
  
  Document:
  ${markdown}
  
  Return a JSON array of 20 strings representing the questions.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return safeParseJSON(response.text || '', []);
}

export async function generateRiskRadar(markdown: string, language: string) {
  const prompt = `Based on the following medical device regulatory document, perform a regulatory risk assessment across 5 key categories: Clinical Data, Biocompatibility, Software/Cybersecurity, Electrical/EMC, and Performance Testing.
  Score each category from 1 to 10, where 10 means high risk/missing information and 1 means low risk/complete information.
  Output language: ${language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English'}.
  
  Document:
  ${markdown}
  
  Return a JSON array of exactly 5 objects.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            score: { type: Type.NUMBER },
            reasoning: { type: Type.STRING }
          },
          required: ['category', 'score', 'reasoning']
        }
      }
    }
  });

  return safeParseJSON(response.text || '', []);
}

export async function generateSEMatrix(markdown: string, language: string) {
  const prompt = `Based on the following medical device regulatory document, extract or infer a primary predicate device and create a Substantial Equivalence (SE) comparison matrix.
  Compare at least 5 key features (e.g., Intended Use, Materials, Design, Performance, Technology).
  Output language: ${language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English'}.
  
  Document:
  ${markdown}
  
  Return a JSON object.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          predicateName: { type: Type.STRING },
          comparisons: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                feature: { type: Type.STRING },
                subjectDevice: { type: Type.STRING },
                predicateDevice: { type: Type.STRING },
                equivalence: { type: Type.STRING, description: "Must be 'Identical', 'Similar', or 'Different'" }
              },
              required: ['feature', 'subjectDevice', 'predicateDevice', 'equivalence']
            }
          }
        },
        required: ['predicateName', 'comparisons']
      }
    }
  });

  return safeParseJSON(response.text || '', {});
}

export async function generateDeficiencyLetter(markdown: string, language: string) {
  const prompt = `Based on the following medical device regulatory document, act as an FDA Lead Reviewer and generate a simulated "Deficiency Letter" or "Request for Additional Information" (RTA/AI).
  Identify the top 3-5 most likely regulatory pushbacks or missing data points.
  Output language: ${language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English'}.
  
  Document:
  ${markdown}
  
  Return a JSON object representing the letter.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      maxOutputTokens: 8192,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          reviewerName: { type: Type.STRING },
          deficiencies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                description: { type: Type.STRING },
                requestedAction: { type: Type.STRING }
              },
              required: ['id', 'description', 'requestedAction']
            }
          }
        },
        required: ['date', 'reviewerName', 'deficiencies']
      }
    }
  });

  return safeParseJSON(response.text || '', {});
}
