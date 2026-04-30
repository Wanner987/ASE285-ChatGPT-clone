---
marp: true
theme: default
paginate: true
class: lead
---

# User Manual: Setting Up the Gemini Clone

This guide will help you configure your environment and launch the full-stack chat application using the Google Gemini API.

---

## Step 1: Obtain a Google Gemini API Key
To use the AI features, you need a free API key from Google AI Studio.

1.  **Visit Google AI Studio:** Go to [aistudio.google.com](https://aistudio.google.com/).
2.  **Sign In:** Use your standard Google account.
3.  **Create API Key:**
    *   On the left sidebar, click the **"Get API key"** button.
    *   Click **"Create API key"**. You may be asked to select or create a new Google Cloud project; choose "Create API key in new project" if it's your first time.
4.  **Copy the Key:** A long string (starting with `AIza...`) will appear. Copy this and keep it safe—treat it like a password.

> **Note:** The "Free Tier" currently allows for generous daily limits, but your data may be used to improve Google's models.

---

## Step 2: Configure the Client
Now, you need to tell your React application which API key to use.

1.  Navigate to the following file in your project folder:
    `my-app/client/config/gemini.js`
2.  Open the file in your code editor (like VS Code).
3.  Find the variable (likely named `apiKey` or similar) and paste your key inside the quotes:
    ```javascript
    // Example:
    const apiKey = "AIzaSyB_YOUR_KEY_HERE_12345";
    ```
4.  **Save the file.**

---

## Step 3: Launch the Application
Your project includes a convenient shell script to start both the frontend and backend at the same time.

1.  Open your **Git Bash** (or terminal) and navigate to the root `my-app` directory.
2.  Run the orchestration script:
    ```bash
    ./run.sh
    ```
3.  **What happens next?**
    *   The script will start the **Express server** on its designated port.
    *   It will launch the **React development server**.
    *   Your default browser should automatically open to `http://localhost:3000` (or the port specified in your client config).

---

## Troubleshooting
*   **API Errors:** If the chat isn't responding, double-check that your API key is correctly pasted in `gemini.js` and that you haven't exceeded your free tier quota.
*   **Script Permission:** If `./run.sh` gives a "Permission denied" error, run `chmod +x run.sh` in your terminal and try again.
*   **Missing Dependencies:** Ensure you have run `npm install` inside both the `/client` and `/server` folders before the first launch.

[Google Gemini API Key Tutorial](https://www.youtube.com/watch?v=kEbWaJ6UyNo)

This video provides a clear, step-by-step visual walkthrough of navigating Google AI Studio to generate your free API key.
```
http://googleusercontent.com/youtube_content/1