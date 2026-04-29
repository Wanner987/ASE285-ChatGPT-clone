// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

let tempDisable = false;
let GEMINI_API_KEY = "AIzaSyA_SXOOetN4nndDyJP-GbJKcjvCvq92IyA";

async function runChat(prompt, chatId) {
  const ai = new GoogleGenAI({
    apiKey: GEMINI_API_KEY,
  });

  if (tempDisable) {
    return 'Gemini API is temporarily disabled';
  }

  // Save the users prompt to the database and get the chat_id (new or existing)
  const userSaveResponse = await fetch('http://localhost:5000/api/save_chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        chat_id: chatId, 
        role: 'user',
        parts: [{ text: prompt }] // Wrap the string in the parts array
  })
  });
  
  const userData = await userSaveResponse.json();
  const currentChatId = userData.chat_id; // Capture the ID (new or existing)

  console.log("Current Chat ID:", currentChatId);

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
  
  const currentConversationContext = await fetch(`http://localhost:5000/api/history/${currentChatId}`);
  const currentConversationContextJson = await currentConversationContext.json();
  
  
  const contents = currentConversationContextJson.map(message => ({
    role: message.role,
    parts: message.parts
  }));

  console.log("Contents:", currentConversationContextJson);

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

  // Save the models full response to the database with the same chat_id
  await fetch('http://localhost:5000/api/save_chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        chat_id: currentChatId, 
        role: 'model', // Matches Gemini's role naming
        parts: [{ text: fullResponse }] // Wrap the full AI response
  })
  });

  return [fullResponse, currentChatId];
}

export default runChat;


