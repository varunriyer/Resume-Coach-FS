import os
from typing import Dict, List
import json
from openai import OpenAI


class AICoach:
    def __init__(self, model=None):
        """Initialize the API client with configurable model."""
        try:
            # Use model from parameter, environment variable, or default to llama-3
            self.model = model or os.environ.get("MODEL", "llama-3")

            # Configure the client with Groq API
            self.client = OpenAI(
                api_key=os.environ.get("GROQ_API_KEY"),
                base_url="https://api.groq.com/openai/v1",
            )

            # Map the model selection to specific Groq model names
            if self.model == "llama-3":
                self.model_name = "llama-3.3-70b-versatile"  # llama-3 model
            elif self.model == "llama-3-instant":
                self.model_name = "llama-3.1-8b-instant"  # Updated LLaMA-3 model
            elif self.model == "gemma":
                self.model_name = "gemma2-9b-it"  # Updated Gemma2 model
            else:
                # Default to llama-3 if an unsupported model is specified
                self.model_name = "llama-3.3-70b-versatile"

        except Exception as e:
            raise Exception(f"Failed to initialize Groq API client: {str(e)}")

    def analyze_resume(self, resume_text: str, job_description: str) -> Dict:
        """Analyze resume against job description using Groq API."""
        try:
            # Customize prompt based on model to improve JSON formatting
            if self.model == "gemma" or self.model == "llama-3-instant":
                # More explicit JSON formatting instructions for Gemma and LLaMA models
                prompt = f"""Analyze this resume and job description in detail:

Resume:
{resume_text}

Job Description:
{job_description}

You MUST provide output in this EXACT JSON format with no additional text before or after:
{{
    "match_percentage": <number between 0-100>,
    "matching_skills": [<list of matching skills as strings>],
    "missing_skills": [<list of missing skills as strings>],
    "extra_skills": [<list of additional skills as strings>],
    "recommendations": [<list of recommendations as strings>]
}}

Ensure your response is valid JSON with double quotes around keys and string values. Do not include any markdown formatting or code blocks."""

                system_message = "You are an expert career coach analyzing resumes and job descriptions. Your ONLY task is to output valid, parseable JSON in the exact format requested."
            else:
                # Standard prompt for llama-3 which handles JSON well
                prompt = f"""Analyze this resume and job description in detail:

Resume:
{resume_text}

Job Description:
{job_description}

Provide output in this exact JSON format:
{{
    "match_percentage": <number between 0-100>,
    "matching_skills": [<list of matching skills>],
    "missing_skills": [<list of missing skills>],
    "extra_skills": [<list of additional skills>],
    "recommendations": [<list of recommendations>]
}}"""

                system_message = "You are an expert career coach analyzing resumes and job descriptions. Provide analysis in JSON format."

            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=8192,
            )
            content = response.choices[0].message.content

            # Clean up the response for better JSON parsing
            # Remove markdown code blocks if present
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0].strip()
            elif "```" in content:
                content = content.split("```")[1].split("```")[0].strip()

            # Try to parse the JSON response
            try:
                return json.loads(content)
            except json.JSONDecodeError as e:
                # Log the error and content for debugging
                print(f"JSON parse error: {str(e)}")
                print(f"Content received: {content}")

                # Fallback in case the response is not valid JSON
                return {
                    "match_percentage": 0,
                    "matching_skills": [],
                    "missing_skills": [],
                    "extra_skills": [],
                    "recommendations": [
                        f"Error: Could not analyze resume with {self.model} model. Please try another model or try again."
                    ],
                }

        except Exception as e:
            raise Exception(f"Error analyzing resume: {str(e)}")

    def get_coaching_advice(self, query: str, context: Dict) -> str:
        """Generate coaching advice based on user query and context using Groq API."""
        try:
            prompt = f"""Context about the user's situation:
{json.dumps(context, indent=2)}

User Query: {query}

Provide specific, actionable career advice based on the context and query."""

            system_message = "You are an expert career coach providing specific and actionable advice."

            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=5000,
            )
            return response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"Error generating coaching advice: {str(e)}")

    def generate_improvement_plan(self, missing_skills: List[str]) -> List[str]:
        """Generate a learning plan for missing skills."""
        try:
            prompt = f"""Create a detailed learning plan for these skills: {', '.join(missing_skills)}

Please provide specific steps in a bullet point format, with each point being clear and actionable."""

            system_message = "Create practical, step-by-step learning plans for developing professional skills."

            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.7,
                max_tokens=5000,
            )
            content = response.choices[0].message.content.strip()

            # Split response into lines and filter for bullet points
            plan = content.split("\n")
            return [
                item.strip()
                for item in plan
                if item.strip().startswith("-") or item.strip().startswith("•")
            ]
        except Exception as e:
            raise Exception(f"Error generating improvement plan: {str(e)}")
