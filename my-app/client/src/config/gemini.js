// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

let tempDisable = true;
GEMINI_API_KEY = "your api key here";

async function runChat(prompt) {
  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });

  if (tempDisable) {
    return 'Gemini API is temporarily disabled';
  }

  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    
    tools,
  };
  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  let fullResponse = '';
  for await (const chunk of response) {
    if (chunk.text) {
      console.log(chunk.text);
      fullResponse += chunk.text;
    }
  }
  return fullResponse;
}

export default runChat;


