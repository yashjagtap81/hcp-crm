from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from langchain_core.messages import HumanMessage

from database import get_db, engine
import models
from agent.graph import graph

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HCP CRM API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = "default"

class InteractionRequest(BaseModel):
    hcp_id: int
    interaction_type: str
    notes: str

@app.post("/chat")
async def chat(request: ChatRequest):
    result = graph.invoke({
        "messages": [HumanMessage(content=request.message)]
    })
    last_message = result["messages"][-1]
    return {"response": last_message.content}

@app.post("/interactions")
async def create_interaction(req: InteractionRequest, db: Session = Depends(get_db)):
    interaction = models.Interaction(
        hcp_id=req.hcp_id,
        interaction_type=req.interaction_type,
        notes=req.notes
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction

@app.get("/interactions/{hcp_id}")
async def get_interactions(hcp_id: int, db: Session = Depends(get_db)):
    return db.query(models.Interaction).filter(models.Interaction.hcp_id == hcp_id).all()

@app.get("/hcps")
async def get_hcps(db: Session = Depends(get_db)):
    return db.query(models.HCP).all()

@app.get("/health")
async def health():
    return {"status": "ok"}
