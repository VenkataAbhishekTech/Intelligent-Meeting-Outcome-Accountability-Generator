from fastapi import FastAPI, UploadFile, File, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import datetime
import os
import shutil
import tempfile
from app.services.ai import transcribe_audio, extract_outcomes

# --- Pydantic Models for Schema ---
class MeetingItem(BaseModel):
    id: int
    type: str  # "Decision", "Action Item", "Risk"
    description: str
    owner: Optional[str] = None
    created_at: str

class MeetingOutcomeResponse(BaseModel):
    meeting_id: str
    filename: str
    outcomes: List[MeetingItem]

# --- FastAPI App Initialization ---
app = FastAPI(
    title="Intelligent Meeting Outcome API",
    description="API for processing meeting transcripts and extracting outcomes.",
    version="1.0.0"
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dummy Auth Dependency ---
def get_current_user(token: str = "dummy-token"):
    # Placeholder for JWT validation
    if token != "dummy-token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return {"username": "admin"}

# --- Routes ---
@app.get("/")
def read_root():
    return {"message": "Welcome to Intelligent Meeting Outcome API"}

@app.post("/api/v1/upload", response_model=MeetingOutcomeResponse)
async def upload_transcript(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload a meeting audio or text file for processing.
    """
    # 1. Read file and extract text
    filename = file.filename.lower()
    transcript_text = ""
    
    if filename.endswith(('.mp3', '.wav', '.m4a', '.mp4')):
        # Save temp file for Whisper
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{filename.split('.')[-1]}") as temp_audio:
            shutil.copyfileobj(file.file, temp_audio)
            temp_path = temp_audio.name
            
        try:
            transcript_text = transcribe_audio(temp_path)
        finally:
            os.remove(temp_path)
    else:
        # Assume text file
        content = await file.read()
        transcript_text = content.decode('utf-8')

    # 2. Pass Text to LLM
    raw_outcomes = extract_outcomes(transcript_text)
    
    # 3. Format into Pydantic models
    formatted_outcomes = []
    for idx, item in enumerate(raw_outcomes, start=1):
        formatted_outcomes.append(
            MeetingItem(
                id=idx,
                type=item.get("type", "Action Item"),
                description=item.get("description", "No description provided."),
                owner=item.get("owner"),
                created_at=datetime.datetime.now().isoformat()
            )
        )
    
    return {
        "meeting_id": "meet-12345",
        "filename": file.filename,
        "outcomes": formatted_outcomes
    }


