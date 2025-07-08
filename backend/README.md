# 🧠 Resume Coach AI – Backend

This is the **FastAPI backend** for the Resume Coach AI project. It powers resume and job description analysis using Groq’s large language models (LLaMA-3, Gemma, etc.) and exposes a `/analyze` API endpoint for the Angular frontend.

---

## 📂 Folder Structure

```
backend/
├── main.py             # FastAPI app and /analyze endpoint
├── ai_coach.py         # Handles AI model logic (Groq API)
├── resume_parser.py    # Parses PDF/DOCX/TXT resumes and JD files
├── chat_interface.py   # (Optional) Streamlit interface for quick testing
├── temp_uploads/       # Temporary file storage
└── venv/               # Virtual environment (not tracked by git)
```

---

## 🚀 Running the Backend

### 1. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install fastapi uvicorn python-multipart openai PyPDF2 python-docx
```

### 3. Set your Groq API Key

```bash
export GROQ_API_KEY="your_api_key_here"
```

### 4. Run the FastAPI server

```bash
uvicorn main:app --reload
```

Visit [http://localhost:8000/docs](http://localhost:8000/docs) to test the API using Swagger UI.

---

## 💬 Optional: Streamlit Chat Interface

`chat_interface.py` is a Streamlit-based chat interface for interacting with the AI directly. Use it for quick testing or as a lightweight UI alternative to the Angular frontend.

To run:

```bash
streamlit run chat_interface.py
```

---

## 📎 Notes

- The backend supports `.pdf`, `.docx`, and `.txt` files.
- The `/analyze` endpoint accepts a resume and job description (as text or file) and returns structured AI feedback.
- Ensure the Angular frontend sends form-data correctly to this backend.

---

## 🛠️ Next Steps

- [x] Connect to frontend
- [x] Deploy backend (Render, Railway, etc.)
- [x] Secure with API keys / auth layer (optional)
