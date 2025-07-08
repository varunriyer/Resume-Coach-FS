from fastapi import FastAPI, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

app = FastAPI()

# Allow Angular frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:4200"] for stricter
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Backend is running!"}


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    jd_text: Optional[str] = Form(None),
    jd_file: Optional[UploadFile] = File(None),
    model: str = Form(...),
):
    # TODO: Use your ai_coach.py and resume_parser.py here
    return {
        "resume_filename": resume.filename,
        "jd_text_received": bool(jd_text),
        "jd_file_received": jd_file.filename if jd_file else None,
        "model_selected": model,
    }
