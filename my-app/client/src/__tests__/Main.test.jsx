jest.mock('../config/gemini', () => ({
  __esModule: true,
  default: async (prompt, chatId) => [
    `Mock response for prompt: ${prompt}`,
    chatId ?? 1,
  ],
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Main from '../components/main/main';
import { Context } from '../context/Context';

const setInputMock = jest.fn();
const onSentMock = jest.fn();

const renderWithContext = (contextValue) => {
  return render(
    <Context.Provider value={contextValue}>
      <Main />
    </Context.Provider>
  );
};

describe('Main component', () => {
  test('displays greeting when no result is shown', () => {
    renderWithContext({
      onSent: onSentMock,
      recentPrompt: '',
      showResult: false,
      loading: false,
      resultData: '',
      setInput: setInputMock,
      input: '',
    });

    expect(screen.getByText(/How can I help you today\?/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter a prompt here/i)).toBeInTheDocument();
  });

  test('displays result content when showResult is true', () => {
    renderWithContext({
      onSent: onSentMock,
      recentPrompt: 'Hello',
      showResult: true,
      loading: false,
      resultData: 'Response content',
      setInput: setInputMock,
      input: '',
    });

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Response content')).toBeInTheDocument();
  });

  test('calls setInput when changing the input field', () => {
    renderWithContext({
      onSent: onSentMock,
      recentPrompt: '',
      showResult: false,
      loading: false,
      resultData: '',
      setInput: setInputMock,
      input: '',
    });

    const inputField = screen.getByPlaceholderText(/Enter a prompt here/i);
    fireEvent.change(inputField, { target: { value: 'test value' } });

    expect(setInputMock).toHaveBeenCalledWith('test value');
  });
});
