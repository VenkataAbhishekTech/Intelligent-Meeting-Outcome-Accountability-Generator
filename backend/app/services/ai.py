import os
import json
import whisper
import ollama
from typing import List, Dict, Any

# Load Whisper model globally so it doesn't reload on every request
# 'small' model provides a much better balance of accuracy and speed than 'base'
try:
    print("Loading local Whisper model (small)...")
    whisper_model = whisper.load_model("small")
except Exception as e:
    print(f"Failed to load Whisper model: {e}")
    whisper_model = None

def transcribe_audio(file_path: str) -> str:
    """
    Transcribes an audio file using the local Whisper model.
    """
    if not whisper_model:
        raise RuntimeError("Whisper model is not loaded.")
        
    try:
        result = whisper_model.transcribe(file_path)
        return result["text"]
    except Exception as e:
        print(f"Error during local transcription: {e}")
        raise e

def extract_outcomes(transcript_text: str) -> List[Dict[str, Any]]:
    """
    Extracts decisions, action items, and risks from a transcript text
    using local Ollama (llama3.2), returning structured JSON data.
    """
    prompt = f"""
    You are a Senior Executive Assistant analyzing a meeting transcript.
    Your goal is to extract highly accurate, professionally written outcomes.
    
    Categorize them strictly into three types:
    1. "Decision": Finalized choices or agreements made by the team.
    2. "Action Item": Specific tasks to be completed. You MUST include the 'owner' if mentioned, otherwise null.
    3. "Risk": Potential blockers, concerns, or negative implications raised.

    Rules for descriptions:
    - Write complete, coherent sentences.
    - Fix any obvious transcription typos or broken English.
    - Be concise but comprehensive.

    Return a valid JSON array of objects. Each object must have exactly these keys:
    - "type": (Must be one of "Decision", "Action Item", "Risk")
    - "description": (Clear, professional string describing the item)
    - "owner": (String name, or null)

    Do not include any Markdown wrappers like ```json. Just the raw JSON array.

    Transcript:
    \"\"\"
    {transcript_text}
    \"\"\"
    """

    try:
        # Use the local Ollama Python client, pointing to the host machine
        # since this runs inside a Docker container on Mac
        client = ollama.Client(host='http://host.docker.internal:11434')
        response = client.chat(
            model='llama3.2',
            messages=[
                {"role": "system", "content": "You output only valid, raw JSON array of objects without markdown formatting."},
                {"role": "user", "content": prompt}
            ],
            options={"temperature": 0.1}
        )
        
        # Parse JSON string from response
        content = response['message']['content'].strip()
        
        # Clean up markdown if the LLM leaked it anyway
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
            
        parsed_outcomes = json.loads(content.strip())
        return parsed_outcomes

    except Exception as e:
        print(f"Error during local extraction: {e}")
        raise e
