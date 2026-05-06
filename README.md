# Intelligent Meeting Outcome & Accountability Generator

A powerful Full-Stack application to transcribe, analyze, and structure meeting outcomes.

## 🚀 Tech Stack

* **Backend**: FastAPI (Python), PostgreSQL, JWT Auth
* **Frontend**: React.js, Vite, Tailwind CSS
* **Infrastructure**: Docker Compose

## 🛠️ VS Code Setup Instructions

1. **Prerequisites**: Ensure you have Docker and Docker Compose installed.
2. **Open in VS Code**: Open the root directory (`Intelligent Meeting Outcome`) in VS Code.
3. **Start the Application**:
   Open a new terminal in VS Code and run:
   ```bash
   docker-compose up --build
   ```
4. **Access the Services**:
   - Frontend Dashboard: [http://localhost:5173](http://localhost:5173)
   - Backend API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - PostgreSQL: `localhost:5432`

## 📂 Project Structure

* `backend/`: FastAPI application, NLP modules, and Database interactions.
* `frontend/`: React + Tailwind Dashboard.

## 🔑 Key Features
* Transcription Processing Endpoint.
* NLP Analysis to categorize Decisions, Action Items, and Risks.
* Professional Dashboard for viewing extracted outcomes.
