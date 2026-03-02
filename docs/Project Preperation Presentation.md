---
marp: true
theme: default
paginate: true
class: lead
---

# Chat-GPT Clone — Individual Project
### Chat-based AI App

**Core Features**
- Promting AI 
- Stored Conversations

---

# Project Description

**Chat-GBT Clone** is a chat bot that looks like Chat-GPT that will use React (Frontend) and Websocket(Backend). The main purpose of this project is to understand React development, working with AI API like OpenAI or Gemini, sessions, WebSocket backend, and deployment.

---

# Core Features (Overview)

1. Promting AI for responces
2. Storing the current conversation
3. Save converation to go back to later 
4. Standalone desktop application

---

# Feature 1: Promting AI for responces

- Uses React as the frontend to display the conversation
- Uses OpenAI or Gemini API

---

# Feature 2: Storing the current conversation

- Uses sessions to store the current conversation so the user can have a more in depth conversation

---

# Feature 3: Save conversations for later

- Interface to store and choose conversations
- Locally store conversations

---

# Feature 4: Standalone desktop application

- Uses Electron to create a standalone desktop application

---

# Key Requirements (Implementation Notes)

- React-based single-page application
- AI API (OpenAI or Gemini)
- WebSocket
- Electron
- Sessions
- Local Storage

---

# Architecture

- React single-page frontend
- WebSocket for backend
- Electron for desktop application

--- 

# Testing Strategy

- Unit Testing
  - React component rendering (Chat window, Message bubble, Sidebar)
  - WebSocket message handlers
  - Session management logic
  - Local storage save/load functions
  - API request/response formatting

---

- Integration Testing
  - Frontend ↔ WebSocket communication
  - Session persistence across refresh
  - Saving and loading previous conversations
  - API response properly rendered in UI

---

- End-to-End (E2E) Testing
- Test full user workflows:
  - User opens app → sends message → receives AI response
  - Conversation persists after refresh
  - User saves conversation → reloads app → conversation is restored
  - Desktop app (Electron) launches and connects to backend

--- 

# Schedule & Milestones

## Sprint 1

- React project setup
- Basic chat UI
- AI API basic messaging

---

## Sprint 2

- Sessions
- Storing conversations
- Electron 