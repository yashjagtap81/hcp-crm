# HCP CRM — AI-First Healthcare Professional Interaction System

An AI-powered CRM system for Life Sciences field representatives to log and manage interactions with Healthcare Professionals (HCPs) using LangGraph + Groq LLM.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Redux Toolkit, Axios |
| Backend | Python 3.11, FastAPI, Uvicorn |
| AI Agent | LangGraph, LangChain-Groq |
| LLM | Groq — gemma2-9b-it |
| Database | PostgreSQL via SQLAlchemy |
| Font | Google Inter |

---

## Architecture

```
React + Redux (Frontend)
        │
        ▼
FastAPI Backend
        │
        ▼
LangGraph Agent  ◄──►  Groq LLM (gemma2-9b-it)
        │
        ▼
   5 LangGraph Tools
        │
        ▼
   PostgreSQL Database
```

---

## LangGraph Tools

| # | Tool | Description |
|---|---|---|
| 1 | log_interaction | Logs HCP interaction, LLM summarizes notes |
| 2 | edit_interaction | Modifies existing interaction record |
| 3 | get_hcp_profile | Fetches HCP details from database |
| 4 | schedule_followup | Sets follow-up date on interaction |
| 5 | analyze_sentiment | LLM classifies sentiment of notes |

---

## Project Structure

```
hcp-crm/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── requirements.txt
│   ├── .env.example
│   └── agent/
│       ├── graph.py
│       └── tools.py
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.js
│   │   ├── index.css
│   │   ├── api/api.js
│   │   ├── store/
│   │   │   ├── index.js
│   │   │   └── interactionSlice.js
│   │   └── components/
│   │       ├── LogInteractionForm.jsx
│   │       └── ChatInterface.jsx
│   ├── package.json
│   └── .env.example
├── .gitignore
└── README.md
```

---

## Setup & Run

### Prerequisites
- Node.js v18+
- Python 3.11+
- PostgreSQL
- Groq API key from console.groq.com

### 1. Clone repo
```bash
git clone https://github.com/YOUR_USERNAME/hcp-crm.git
cd hcp-crm
```

### 2. Create database
```sql
CREATE DATABASE hcp_crm;
```

### 3. Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit .env and add your GROQ_API_KEY and DATABASE_URL

uvicorn main:app --reload --port 8000
```

### 4. Frontend setup
```bash
cd frontend
npm install

# Create .env file
copy .env.example .env

npm start
```

### 5. Add sample data
```sql
INSERT INTO hcps (name, specialization, location, email) VALUES
  ('Dr. Priya Sharma', 'Cardiologist', 'Mumbai', 'priya@hospital.com'),
  ('Dr. Rahul Mehta', 'Oncologist', 'Pune', 'rahul@clinic.com'),
  ('Dr. Anjali Singh', 'Neurologist', 'Delhi', 'anjali@medcenter.com');
```

---

## URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /health | Health check |
| GET | /hcps | Get all HCPs |
| POST | /interactions | Log interaction (form) |
| GET | /interactions/{hcp_id} | Get HCP interactions |
| POST | /chat | Chat with AI agent |

---

## Features

- Dual interface: structured form + AI chat
- LangGraph stateful agent with 5 tools
- Groq LLM for summarization and sentiment analysis
- Redux state management
- Auto-generated FastAPI docs at /docs
- PostgreSQL persistence
