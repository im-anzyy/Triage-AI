import requests
import chromadb
from sentence_transformers import SentenceTransformer

# NIH MedlinePlus Health Topics API — completely free
TOPICS = [
    "headache", "chest pain", "fever", "shortness of breath",
    "abdominal pain", "back pain", "dizziness", "nausea",
    "fatigue", "sore throat", "cough", "rash", "anxiety",
    "high blood pressure", "diabetes", "asthma", "allergies",
    "heart attack", "stroke", "appendicitis"
]

def fetch_nih_topic(topic):
    url = f"https://wsearch.nlm.nih.gov/ws/query?db=healthTopics&term={topic}"
    try:
        r = requests.get(url, timeout=10)
        return r.text[:2000]  # chunk to 2000 chars
    except:
        return f"General information about {topic}."

print("Building knowledge base...")
model = SentenceTransformer('all-MiniLM-L6-v2')
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection("medical_kb")

for topic in TOPICS:
    print(f"Fetching: {topic}")
    content = fetch_nih_topic(topic)
    embedding = model.encode(content).tolist()
    collection.add(
        documents=[content],
        embeddings=[embedding],
        ids=[topic.replace(" ", "_")]
    )

print("Knowledge base ready!")