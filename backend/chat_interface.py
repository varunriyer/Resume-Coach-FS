from typing import Dict, List
import streamlit as st
from ai_coach import AICoach

class ChatInterface:
    def __init__(self, ai_coach: AICoach):
        self.ai_coach = ai_coach
        if "messages" not in st.session_state:
            st.session_state.messages = []

    def display_chat(self):
        """Display chat interface and handle messages."""
        st.subheader("Chat with Your Career Coach")
        
        # Display chat messages
        for message in st.session_state.messages:
            with st.chat_message(message["role"]):
                st.markdown(message["content"])

        # Chat input
        if prompt := st.chat_input("Ask your career coach a question..."):
            # Add user message
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)

            # Generate AI response
            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    context = self.get_chat_context()
                    response = self.ai_coach.get_coaching_advice(prompt, context)
                    st.markdown(response)
                    st.session_state.messages.append({"role": "assistant", "content": response})

    def get_chat_context(self) -> Dict:
        """Get context from session state for AI responses."""
        return {
            "analysis": st.session_state.get("analysis", {}),
            "resume_text": st.session_state.get("resume_text", ""),
            "job_description": st.session_state.get("job_description", "")
        }

    def clear_chat_history(self):
        """Clear chat history."""
        st.session_state.messages = []
