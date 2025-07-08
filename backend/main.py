from fastapi import FastAPI, UploadFile, File, Form
from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
from dotenv import load_dotenv  # ✅ Load environment variables

from resume_parser import DocumentParser
from ai_coach import AICoach

# ✅ Load .env file
load_dotenv()

app = FastAPI()

# ✅ Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to your frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Resume Coach AI backend is running"}


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    jd_text: Optional[str] = Form(None),
    jd_file: Union[UploadFile, None, str] = File(default=None),
    model: str = Form(...),
):
    parser = DocumentParser()

    # ✅ Parse resume from bytes
    resume_bytes = await resume.read()
    resume_text = parser.parse_resume(
        resume_bytes, os.path.splitext(resume.filename)[-1]
    )

    # ✅ Determine JD source: text or file
    jd_text_final = jd_text
    if jd_file and jd_file.filename != "":
        jd_bytes = await jd_file.read()
        jd_text_final = parser.parse_resume(
            jd_bytes, os.path.splitext(jd_file.filename)[-1]
        )

    # ✅ Validate JD input
    if not jd_text_final or jd_text_final.strip() == "":
        return {"error": "No job description provided."}

    # ✅ Run AI analysis
    coach = AICoach(model=model)
    feedback = coach.analyze_resume(
        resume_text=resume_text, job_description=jd_text_final
    )

    return {"feedback": feedback, "model_used": model}
