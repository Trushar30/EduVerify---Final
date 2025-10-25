
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

interface OtherSubmission {
    studentName: string;
    fileContent: string;
}

export const analyzeContent = async (
  documentText: string,
  otherSubmissions: OtherSubmission[] = []
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return {
        plagiarismScore: 0,
        aiContentScore: 0,
        analysisSummary: "Error: API Key not configured. This is a mock response.",
        plagiarizedSources: [],
    };
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let otherSubmissionsText = "No other student submissions were provided for internal comparison.";
  if (otherSubmissions && otherSubmissions.length > 0) {
    otherSubmissionsText = `
--- INTERNAL SUBMISSIONS ---
Here is a list of submissions from other students for the same assignment. Compare the text to analyze against these for potential collusion or direct copying.
${otherSubmissions.map(s => `
Submission from: ${s.studentName}
Content: """
${s.fileContent}
"""
---
`).join('\n')}
`;
  }

  const prompt = `
You are an academic integrity expert. Analyze the following academic text for two things:
1. Plagiarism from external web sources.
2. Internal plagiarism by comparing it against a provided list of other student submissions for the same assignment.

Provide a detailed analysis in JSON format. For each plagiarized source, identify:
- The specific snippet from the document.
- The source (URL for web, or student name for internal).
- Your confidence level (0-100).
- The type of source ('INTERNAL' or 'EXTERNAL').
- If internal, the student's name in the 'studentName' field.

--- TEXT TO ANALYZE ---
"""
${documentText}
"""
---

${otherSubmissionsText}
  `;

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              plagiarismScore: {
                type: Type.INTEGER,
                description: "A score from 0 to 100 representing the percentage of plagiarized content from all sources.",
              },
              aiContentScore: {
                type: Type.INTEGER,
                description: "A score from 0 to 100 representing the likelihood that the content was AI-generated.",
              },
              analysisSummary: {
                type: Type.STRING,
                description: "A concise summary of the findings, highlighting key areas of concern.",
              },
              plagiarizedSources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    source: {
                      type: Type.STRING,
                      description: "The URL of the external source, or the name of the student for internal sources.",
                    },
                    snippet: {
                      type: Type.STRING,
                      description: "A direct quote from the submitted document that is considered plagiarized from this source."
                    },
                    confidence: {
                      type: Type.INTEGER,
                      description: "A confidence score from 0-100 indicating the likelihood that this snippet is from the given source."
                    },
                    sourceType: {
                        type: Type.STRING,
                        description: "The type of source, either 'INTERNAL' (another student's submission) or 'EXTERNAL' (a web source).",
                    },
                    studentName: {
                        type: Type.STRING,
                        description: "If the source is internal, provide the name of the student who submitted the matching content. Omit for external sources."
                    }
                  },
                   required: ["source", "snippet", "confidence", "sourceType"],
                },
              },
            },
            required: ["plagiarismScore", "aiContentScore", "analysisSummary", "plagiarizedSources"],
          },
       },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error analyzing content with Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
};