import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

  return JSON.parse(response.text || '[]');
}

export async function generateChecklist(markdown: string, language: string) {
  const prompt = `Based on the following medical device regulatory document, create a comprehensive 100-item review checklist.
  Output language: ${language === 'zh' ? 'Traditional Chinese (繁體中文)' : 'English'}.
  
  Document:
  ${markdown}
  
  Return a JSON array of 100 strings representing the checklist items.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text || '[]');
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
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  return JSON.parse(response.text || '[]');
}
