from langchain_core.tools import tool
from sqlalchemy.orm import Session
from datetime import datetime
from models import Interaction, HCP


@tool
def log_interaction(hcp_id: int, interaction_type: str, notes: str, db: Session) -> dict:
    """Logs a new interaction with an HCP. Uses LLM to generate a summary."""
    interaction = Interaction(
        hcp_id=hcp_id,
        interaction_type=interaction_type,
        notes=notes,
        created_at=datetime.utcnow()
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return {"status": "logged", "interaction_id": interaction.id}


@tool
def edit_interaction(interaction_id: int, updates: dict, db: Session) -> dict:
    """Edits an existing logged interaction by ID."""
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        return {"error": "Interaction not found"}
    for key, value in updates.items():
        setattr(interaction, key, value)
    interaction.updated_at = datetime.utcnow()
    db.commit()
    return {"status": "updated", "interaction_id": interaction_id}


@tool
def get_hcp_profile(hcp_id: int, db: Session) -> dict:
    """Fetches the profile of an HCP by ID."""
    hcp = db.query(HCP).filter(HCP.id == hcp_id).first()
    if not hcp:
        return {"error": "HCP not found"}
    return {
        "id": hcp.id,
        "name": hcp.name,
        "specialization": hcp.specialization,
        "location": hcp.location,
        "email": hcp.email
    }


@tool
def schedule_followup(interaction_id: int, followup_date: str, db: Session) -> dict:
    """Schedules a follow-up date for an existing interaction."""
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        return {"error": "Interaction not found"}
    interaction.followup_date = datetime.strptime(followup_date, "%Y-%m-%d")
    db.commit()
    return {"status": "scheduled", "followup_date": followup_date}


@tool
def analyze_sentiment(interaction_id: int, db: Session) -> dict:
    """Uses LLM to analyze the sentiment of an interaction's notes."""
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()
    if not interaction:
        return {"error": "Interaction not found"}
    return {"notes": interaction.notes, "interaction_id": interaction_id}
