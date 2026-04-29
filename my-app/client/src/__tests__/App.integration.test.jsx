import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { Context } from '../context/Context';

jest.mock('../config/gemini', () => ({
  __esModule: true,
  default: async (prompt, chatId) => [
    `Mock response for: ${prompt}`,
    chatId ?? 1,
  ],
}));

const TestWrapper = ({ children }) => {
  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState('');
  const [currentChatId, setCurrentChatId] = useState(undefined);
  const [previousPrompts, setPreviousPrompts] = useState([]);

  const mockContextValue = {
    previousPrompts,
    setPreviousPrompts,
    onSent: jest.fn(),
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat: jest.fn(),
    setCurrentChatId,
    setShowResult,
    setResultData,
  };

  return (
    <Context.Provider value={mockContextValue}>
      {children}
    </Context.Provider>
  );
};

const renderApp = () => {
  return render(
    <TestWrapper>
      <App />
    </TestWrapper>
  );
};

describe('Client Integration Tests - App Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders initial greeting and allows input', () => {
    renderApp();

    expect(screen.getByText(/How can I help you today\?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter a prompt here/i)).toBeInTheDocument();
  });

  test('sidebar expands and shows recent chats when clicked', async () => {
    // Mock API response for history
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ chat_id: 123, parts: [{ text: 'Recent chat' }] }],
    });

    const { container } = renderApp();

    const menuButton = container.querySelector('.menu');
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText('Recent')).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/history');
  });

  test('clicking recent chat loads and displays history', async () => {
    // Mock history fetch
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ chat_id: 123, parts: [{ text: 'Recent chat' }] }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ role: 'user', parts: [{ text: 'Recent chat' }], timestamp: '2026-04-29T00:00:00Z' }],
      });

    const { container } = renderApp();

    // Expand sidebar
    const menuButton = container.querySelector('.menu');
    fireEvent.click(menuButton);

    await waitFor(() => {
      expect(screen.getByText('Recent chat')).toBeInTheDocument();
    });

    // Click on recent chat
    const recentEntry = screen.getByText('Recent chat');
    fireEvent.click(recentEntry);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:5000/api/history/123');
    });
  });

  test('input field updates and shows send button when not empty', () => {
    const { container } = renderApp();

    const inputField = screen.getByPlaceholderText(/Enter a prompt here/i);
    const searchBox = container.querySelector('.search-box');

    // Initially only gallery and mic icons (2 images)
    expect(searchBox.querySelectorAll('img')).toHaveLength(2);

    // Type something
    fireEvent.change(inputField, { target: { value: 'Hello world' } });

    // Now send button should appear (3 images)
    expect(searchBox.querySelectorAll('img')).toHaveLength(3);
  });
});