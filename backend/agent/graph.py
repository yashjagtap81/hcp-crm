from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
import operator
import os

from agent.tools import (
    log_interaction, edit_interaction,
    get_hcp_profile, schedule_followup, analyze_sentiment
)

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="gemma2-9b-it"
)

tools = [log_interaction, edit_interaction, get_hcp_profile, schedule_followup, analyze_sentiment]
llm_with_tools = llm.bind_tools(tools)

SYSTEM_PROMPT = """You are an AI assistant for a Life Sciences CRM system.
You help field representatives log and manage interactions with Healthcare Professionals (HCPs).
Use the available tools to log interactions, edit records, fetch HCP profiles,
schedule follow-ups, and analyze sentiment.
Always summarize interaction notes clearly and concisely."""

def call_model(state: AgentState):
    messages = [SystemMessage(content=SYSTEM_PROMPT)] + list(state["messages"])
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}

def should_continue(state: AgentState):
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

tool_node = ToolNode(tools)
graph_builder = StateGraph(AgentState)
graph_builder.add_node("agent", call_model)
graph_builder.add_node("tools", tool_node)
graph_builder.set_entry_point("agent")
graph_builder.add_conditional_edges("agent", should_continue)
graph_builder.add_edge("tools", "agent")

graph = graph_builder.compile()
