export default async function runChat(prompt, chatId) {
  return [
    `Mock response for prompt: ${prompt}`,
    chatId ?? 1,
  ];
}
