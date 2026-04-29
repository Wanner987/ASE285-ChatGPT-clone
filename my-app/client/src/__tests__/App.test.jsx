jest.mock('../config/gemini', () => ({
  __esModule: true,
  default: async (prompt, chatId) => [
    `Mock response for prompt: ${prompt}`,
    chatId ?? 1,
  ],
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { Context } from '../context/Context';

const mockContextValue = {
  previousPrompts: [],
  setPreviousPrompts: jest.fn(),
  onSent: jest.fn(),
  setRecentPrompt: jest.fn(),
  recentPrompt: 'Test prompt',
  showResult: false,
  loading: false,
  resultData: '',
  input: '',
  setInput: jest.fn(),
  newChat: jest.fn(),
  setCurrentChatId: jest.fn(),
  setShowResult: jest.fn(),
  setResultData: jest.fn(),
};

describe('App component', () => {
  test('renders sidebar and main content', () => {
    render(
      <Context.Provider value={mockContextValue}>
        <App />
      </Context.Provider>
    );

    expect(screen.getByText(/How can I help you today\?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter a prompt here/i)).toBeInTheDocument();
  });
});
