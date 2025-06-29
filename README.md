# 🔥 "Jugnu" AI LinkedIn Comment Generator

A single-page application that uses a custom-trained Gemini AI persona to generate 5 types of strategic, high-quality comments for LinkedIn posts. This project moves beyond generic AI responses to create brand-aligned, conversation-starting engagement.

This tool was built to demonstrate advanced prompt engineering and the ability to create highly customized AI solutions that embody a specific personal brand.


---

### 🌟 Key Features

* **Custom AI Persona:** The AI is instructed to write in the specific "Jugnu" voice—punchy, playful, and founder-focused.
* **Strategic Comment Frameworks:** Generates 5 distinct types of comments: Magnetic, Credibility, Resonance, Funny/Punchline, and Subtle CTA.
* **1-Click Copy:** Each generated comment has a simple button to copy the text to the clipboard instantly.
* **Modern & Fast UI:** A clean, responsive single-page application built with React and Vite for a seamless user experience.

---

### 🛠️ Tech Stack & Tools

* **Frontend:** React (with Vite), TypeScript, Tailwind CSS
* **Backend:** Vercel Serverless Function (or Netlify Functions)
* **AI:** Google Gemini API
* **Deployment:** Vercel / Netlify

---

### 🧠 The Core Prompt (The "Secret Sauce")

The power of this application comes from the detailed, persona-driven prompt engineered to guide the Gemini AI. The backend function uses a variation of the following prompt structure:

```text
You are to act as "Jugnu," a Gen-Z, chai-loving, personal branding ghostwriter...

Your mission is to generate five (5) distinct comments for the LinkedIn post provided... Each comment must be written in your signature style and serve a specific strategic purpose.

Strategic Comment Frameworks (Use one for each comment):
[Magnetic Comment]: Create curiosity...
[Credibility Comment]: Build authority...
[Resonance Comment]: Connect emotionally...
...etc.
