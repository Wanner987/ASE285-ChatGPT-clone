jest.mock('../config/gemini', () => ({
  __esModule: true,
  default: async (prompt, chatId) => [
    `Mock response for prompt: ${prompt}`,
    chatId ?? 1,
  ],
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Sidebar from '../components/sidebar/sidebar';
import { Context } from '../context/Context';

const setRecentPromptMock = jest.fn();
const setCurrentChatIdMock = jest.fn();
const setResultDataMock = jest.fn();
const setShowResultMock = jest.fn();

const contextValue = {
  onSent: jest.fn(),
  previousPrompts: [],
  setRecentPrompt: setRecentPromptMock,
  newChat: jest.fn(),
  setResultData: setResultDataMock,
  setShowResult: setShowResultMock,
  setCurrentChatId: setCurrentChatIdMock,
};

describe('Sidebar component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('loads recent history and displays entries when expanded', async () => {
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ chat_id: 123, parts: [{ text: 'Recent prompt text' }] }] })
      .mockResolvedValueOnce({ ok: true, json: async () => [{ role: 'user', parts: [{ text: 'Recent prompt text' }], timestamp: '2026-04-29T00:00:00Z' }] });

    const { container } = render(
      <Context.Provider value={contextValue}>
        <Sidebar />
      </Context.Provider>
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/history'));

    const menuButton = container.querySelector('.menu');
    fireEvent.click(menuButton);

    await waitFor(() => expect(screen.getByText(/Recent prompt text/i)).toBeInTheDocument());

    const recentEntry = container.querySelector('.recent-entry');
    fireEvent.click(recentEntry);

    await waitFor(() => expect(setResultDataMock).toHaveBeenCalledWith('Recent prompt text'));
    expect(setShowResultMock).toHaveBeenCalledWith(true);
  });
});
