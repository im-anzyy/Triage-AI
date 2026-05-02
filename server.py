from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import chromadb
from sentence_transformers import SentenceTransformer
import requests
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MISTRAL_API_KEY = "**API_key**" #(API key replaced by "**API_key**" temporarily for security purposes)
model = SentenceTransformer('all-MiniLM-L6-v2')
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("medical_kb")

with open("../triage-ai/constants/systemPrompt.js", "r", encoding="utf-8") as f:
    raw = f.read()
SYSTEM_PROMPT = raw.split('`')[1]

class ChatRequest(BaseModel):
    messages: list

def retrieve_context(query: str) -> str:
    embedding = model.encode(query).tolist()
    results = collection.query(
        query_embeddings=[embedding],
        n_results=2
    )
    if results["documents"]:
        return "\n\n".join(results["documents"][0])
    return ""

@app.post("/chat")
async def chat(req: ChatRequest):
    last_user_msg = next(
        (m["content"] for m in reversed(req.messages)
         if m["role"] == "user"), ""
    )

    context = retrieve_context(last_user_msg)

    augmented_system = SYSTEM_PROMPT
    if context:
        augmented_system += f"""

════════════════════════════════════
RELEVANT MEDICAL CONTEXT (from NIH MedlinePlus)
════════════════════════════════════
Use this information to ground your response in
verified medical knowledge:

{context}
════════════════════════════════════
"""

    response = requests.post(
        "https://api.mistral.ai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {MISTRAL_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "mistral-large-latest",
            "max_tokens": 1024,
            "messages": [
                {"role": "system", "content": augmented_system},
                *req.messages
            ]
        }
    ).json()

    raw = response["choices"][0]["message"]["content"]
    import re
    match = re.search(r'\[SEVERITY:(LOW|MEDIUM|HIGH)\]', raw)
    severity = match.group(1) if match else "LOW"
    clean = re.sub(r'\[SEVERITY:(LOW|MEDIUM|HIGH)\]', '', raw).strip()

    return {"text": clean, "severity": severity}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)