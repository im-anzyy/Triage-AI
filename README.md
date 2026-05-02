# Triage — AI Medical Assistant

Triage is a React Native (Expo) mobile app that acts as an AI-powered symptom checker and triage assistant. It walks users through a structured medical interview, assigns a severity rating to their symptoms (LOW / MEDIUM / HIGH), and — when severity is HIGH — automatically navigates to an emergency referral screen. Responses are grounded in NIH MedlinePlus data via a RAG (Retrieval-Augmented Generation) pipeline backed by ChromaDB.

> ⚠️ **This project is under progress.** Several features are stubbed out (e.g. consultation history uses hardcoded data, `TriageAvatar.jsx` is empty, and the backend API key is a placeholder). See the [Known Gaps](#known-gaps) section.

---

## Screenshots / Screens

| Screen | Description |
|---|---|
| **Onboarding** (`app/index.jsx`) | Consent toggles before entering the app |
| **Chat** (`app/chat.jsx`) | Main symptom triage conversation |
| **Referral** (`app/referral.jsx`) | Urgent care prompt triggered on HIGH severity |
| **History** (`app/history.jsx`) | Past consultations (currently hardcoded) |
| **Privacy** (`app/privacy.jsx`) | Privacy architecture explanation |

---

## Tech Stack

### Frontend
- **React Native** 0.83 + **Expo** 55 (canary)
- **React Navigation** (Stack navigator)
- `expo-secure-store`, `expo-speech` (installed, not yet wired up)

### Backend (`triage-backend/`)
- **Python** + **FastAPI** + **Uvicorn**
- **Mistral AI** (`mistral-large-latest`) — the chat LLM
- **ChromaDB** — local vector store for medical knowledge
- **sentence-transformers** (`all-MiniLM-L6-v2`) — embedding model for RAG
- **NIH MedlinePlus API** — free public source for medical topic data

---

## Project Structure

```
Triage-AI/
├── .js/
│   ├── index.js              # Expo entry point
│   └── App.js                # Navigation container
├── .json/
│   ├── app.json              # Expo app config
│   └── package.json          # JS dependencies
├── app/
│   ├── index.jsx             # Onboarding / consent screen
│   ├── chat.jsx              # Main chat interface
│   ├── referral.jsx          # Emergency referral screen
│   ├── history.jsx           # Consultation history
│   └── privacy.jsx           # Privacy info screen
├── components/
│   ├── MessageBubble.jsx     # Animated chat bubble
│   ├── TypingIndicator.jsx   # Animated 3-dot indicator
│   └── TriageAvatar.jsx      # (empty — not implemented)
├── constants/
│   └── systemPrompt.js       # Full system prompt for the AI
└── triage-backend/
    ├── server.py             # FastAPI server — /chat endpoint
    ├── build_kb.py           # One-time script to populate ChromaDB
    └── chroma_db/            # Persisted vector store
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- Expo CLI (`npm install -g expo-cli`)
- A [Mistral AI](https://console.mistral.ai/) API key

---

### 1. Backend setup

```bash
cd triage-backend
pip install fastapi uvicorn chromadb sentence-transformers requests
```

**Set your API key** in `server.py` — replace the `"**API_key**"` placeholder:

```python
MISTRAL_API_KEY = "your_actual_key_here"
```

**Build the knowledge base** (run once):

```bash
python build_kb.py
```

This fetches 20 medical topics from NIH MedlinePlus and stores them as vector embeddings in `./chroma_db`.

**Start the server:**

```bash
python server.py
# Listening on http://0.0.0.0:8000
```

---

### 2. Frontend setup

```bash
# From the repo root
npm install
npx expo start
```

The app expects the backend at `http://localhost:8000`. If you change the host (e.g. for a physical device), update the API URL in the service layer (currently referenced as `../services/triageAPI` in `chat.jsx` — this file is **missing** from the repo; see Known Gaps).

---

## How It Works

1. User accepts consent on the Onboarding screen and taps **Get Started**.
2. The Chat screen opens with a welcome message from Triage.
3. Each user message is sent to the FastAPI `/chat` endpoint with the full conversation history.
4. The backend:
   - Embeds the latest user message with `all-MiniLM-L6-v2`
   - Queries ChromaDB for the 2 most relevant NIH articles
   - Appends those as grounding context to the system prompt
   - Sends the augmented prompt + conversation to Mistral
   - Parses the `[SEVERITY:LOW/MEDIUM/HIGH]` tag from the response
   - Returns `{ text, severity }` to the app
5. If `severity === "HIGH"`, the app auto-navigates to the Referral screen after 1.5 seconds.

---

## AI Behaviour

The system prompt (`constants/systemPrompt.js`) enforces:

- **One question per response** — never multiple at once
- **No diagnosis** — symptom patterns only
- **No medication recommendations** by name
- **Structured triage sequence**: chief complaint → duration → severity → character → associated symptoms → context → assessment
- **Internal severity scoring** (1–10 scale, hidden from user)
- **Automatic escalation** on red-flag symptoms (chest pain, stroke signs, self-harm, etc.)

---

## Known Gaps

This project is a work in progress. The following are incomplete or missing:

- **`services/triageAPI.js`** — imported in `chat.jsx` but not present in the repo. The app will crash without it. You need to create this file:
  ```js
  // services/triageAPI.js
  export async function sendToTriage(messages) {
    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    return res.json();
  }
  ```
- **`components/TriageAvatar.jsx`** — file exists but is empty (0 bytes).
- **History screen** — consultation history is hardcoded with dummy data; no persistence layer is wired up yet (`expo-secure-store` is installed but unused).
- **`expo-speech`** — installed as a dependency but not yet integrated into any screen.
- **Mistral API key** — hardcoded as a placeholder in `server.py`. Move this to an environment variable before any deployment.
- **Backend path assumption** — `server.py` reads the system prompt using a relative path (`../triage-ai/constants/systemPrompt.js`) which assumes a specific directory layout. This will break if you run the server from a different location.
- **CORS** — currently set to `allow_origins=["*"]`. Restrict this before production use.
- **Error handling in `chat.jsx`** — the catch block exposes raw error messages to the user (a temporary debug measure left in place).

---

## Privacy Model

Per the Privacy screen, the intended design is:

- No user account or identity collected
- Conversations not stored server-side
- All symptom data processed in real time and discarded
- Architecture is described as "federated learning ready"

Note: the current backend implementation does not persistently store conversations, but the privacy properties are architectural goals — not yet fully audited or enforced.

---

## License

Not specified. All rights assumed reserved by the project authors.
