---
marp: true
theme: default
paginate: true
class: lead
---

# Design and Architecture: Gemini Clone

## 🏗 High-Level Architecture
This project follows a **Client-Server (Full Stack)** architecture, separating the concerns of the user interface from the backend logic and data persistence.

```text
[ Client (React) ] <---- HTTP/REST ----> [ Server (Node.js/Express) ]
                                                |
                                        [ SQLite Database ]
```

---

## 📂 Directory Structure & Responsibilities

### 1. Root Directory
* `run.sh`: Orchestration script to start both client and server simultaneously.
* `test/`: Global regression scripts to ensure end-to-end stability across the entire stack.

### 2. Frontend (`/client`)
Built using **React**, the frontend is structured for modularity and testability.
* **`src/components/`**: Divided into feature-based folders (`main`, `sidebar`). Each component has its own logic and dedicated CSS.
* **`src/context/`**: Uses the **React Context API** for global state management (handling chat history and API responses without "prop drilling").
* **`src/config/`**: Contains API configurations, specifically for the Gemini integration.
* **`src/__tests__` & `cypress/`**: A dual-layered testing approach using **Jest/React Testing Library** for units and **Cypress** for End-to-End (E2E) browser testing.

### 3. Backend (`/server`)
A **Node.js** environment handling the heavy lifting and data storage.
* **`server.js`**: The entry point for the Express API.
* **`data/`**: Contains `chat_history.db`. This indicates the use of **SQLite** for lightweight, file-based data persistence.
* **`__tests__/`**: Dedicated backend tests including integration and regression suites to validate API endpoints.
* **`test.REST`**: A local file for testing API calls (likely using the VS Code REST Client extension).

---

## 🛠 Tech Stack
* **Frontend:** React, CSS3, Context API.
* **Backend:** Node.js, Express.
* **Database:** SQLite.
* **Testing:** Jest, Cypress, Shell scripting.
* **AI Integration:** Gemini API via custom config.

---

## ⚡ Key Design Patterns
* **Component-Based Architecture:** UI is broken into reusable chunks (Sidebar vs. Main).
* **Separation of Styles:** Each component maintains its own `.css` file in a centralized `styles/` directory for easier maintenance.
* **Mocking:** The presence of `__mocks__` suggests a robust testing strategy where API calls are intercepted to save on token costs and provide consistent test results.

---