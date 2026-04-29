// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

let tempDisable = false;
let GEMINI_API_KEY = "INCERT YOUR GEMINI API KEY HERE";

async function runChat(prompt, chatId) {
  // Save the user's prompt to the database and get the chat_id (new or existing)
  const userSaveResponse = await fetch('http://localhost:5000/api/save_chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      role: 'user',
      parts: [{ text: prompt }]
    })
  });

  const userData = await userSaveResponse.json();
  const currentChatId = userData.chat_id;

  console.log('Current Chat ID:', currentChatId);

  const useMockResponse = tempDisable || !GEMINI_API_KEY || GEMINI_API_KEY.includes('INCERT');

  const currentConversationContext = await fetch(`http://localhost:5000/api/history/${currentChatId}`);
  const currentConversationContextJson = await currentConversationContext.json();

  if (useMockResponse) {
    const mockResponse = `Mocked Gemini reply for: ${prompt}`;

    await fetch('http://localhost:5000/api/save_chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: currentChatId,
        role: 'model',
        parts: [{ text: mockResponse }]
      })
    });

    return [mockResponse, currentChatId];
  }

  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });

  const tools = [
    {
      googleSearch: {}
    },
  ];

  const config = {
    tools,
  };
  const model = 'gemini-2.5-flash';

  const contents = currentConversationContextJson.map(message => ({
    role: message.role,
    parts: message.parts
  }));

  console.log('Contents:', currentConversationContextJson);

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullResponse = '';
  for await (const chunk of response) {
    if (chunk.text) {
      console.log(chunk.text);
      fullResponse += chunk.text;
    }
  }

  await fetch('http://localhost:5000/api/save_chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: currentChatId,
      role: 'model',
      parts: [{ text: fullResponse }]
    })
  });

  return [fullResponse, currentChatId];
}

export default runChat;


