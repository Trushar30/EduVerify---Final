
import { AnalysisResult, PlagiarizedSource } from '../types';

interface OtherSubmission {
    studentName: string;
    fileContent: string;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeContent = async (
  documentText: string,
  otherSubmissions: OtherSubmission[] = []
): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable not set. Please configure your API key in .env.local");
  }

  // Build internal submissions comparison text
  let otherSubmissionsText = "";
  if (otherSubmissions && otherSubmissions.length > 0) {
    otherSubmissionsText = `\n\nCOMPARE AGAINST THESE OTHER SUBMISSIONS FOR INTERNAL PLAGIARISM:\n`;
    otherSubmissions.forEach((sub, idx) => {
      otherSubmissionsText += `\n[Submission ${idx + 1} from ${sub.studentName}]:\n${sub.fileContent}\n---`;
    });
  }

  const prompt = `You are an expert academic integrity analyzer. Analyze this student submission for plagiarism and AI content.

SUBMISSION TO ANALYZE:
"""
${documentText}
"""
${otherSubmissionsText}

IMPORTANT: You MUST respond ONLY with valid JSON, no other text. The JSON must have this exact structure:
{
  "plagiarismScore": <number 0-100>,
  "aiContentScore": <number 0-100>,
  "analysisSummary": "<string with key findings>",
  "plagiarizedSources": [
    {
      "source": "<URL or student name>",
      "snippet": "<exact quote from submission>",
      "confidence": <number 0-100>,
      "sourceType": "EXTERNAL" or "INTERNAL",
      "studentName": "<optional, only for INTERNAL sources>"
    }
  ]
}

Instructions:
1. Check for plagiarism from known sources, the provided student submissions, AND any references to external websites (URLs) found in the submission text.
2. If the submission contains references to external websites (URLs), detect and list each website as a separate entry in the plagiarizedSources array, with the source field set to the URL and sourceType set to "EXTERNAL".
3. Assign a plagiarism score (0-100) based on percentage of potentially plagiarized content, including matches to external websites.
4. Assess likelihood of AI generation (0-100).
5. List each potential plagiarism source with confidence level.
6. For internal matches, include studentName field.
7. Return ONLY valid JSON, no markdown, no explanation.`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Gemini API error response:', errorData);
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!textContent) {
    console.error('No text content in Gemini response:', data);
    throw new Error('No analysis content returned from Gemini API');
  }

  // Clean up the response (remove markdown code blocks if present)
  let jsonText = textContent.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const result = JSON.parse(jsonText);
  
  // Validate the response
  if (typeof result.plagiarismScore !== 'number' || result.plagiarismScore < 0 || result.plagiarismScore > 100) {
    throw new Error(`Invalid plagiarism score from API: ${result.plagiarismScore}`);
  }
  if (typeof result.aiContentScore !== 'number' || result.aiContentScore < 0 || result.aiContentScore > 100) {
    throw new Error(`Invalid AI content score from API: ${result.aiContentScore}`);
  }
  if (!Array.isArray(result.plagiarizedSources)) {
    throw new Error('Invalid plagiarized sources format from API');
  }
  if (!result.analysisSummary || typeof result.analysisSummary !== 'string') {
    throw new Error('Missing analysis summary from API');
  }

  return result as AnalysisResult;
};
