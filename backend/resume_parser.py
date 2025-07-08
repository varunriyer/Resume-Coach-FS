import PyPDF2
import docx
import io
from typing import Optional

class DocumentParser:
    def __init__(self):
        self.supported_formats = ['.pdf', '.txt', '.docx']

    def parse_pdf(self, file_bytes: bytes) -> str:
        """Parse PDF file and extract text."""
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
        except Exception as e:
            raise Exception(f"Error parsing PDF: {str(e)}")

    def parse_docx(self, file_bytes: bytes) -> str:
        """Parse DOCX file and extract text."""
        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            raise Exception(f"Error parsing DOCX: {str(e)}")

    def parse_txt(self, file_bytes: bytes) -> str:
        """Parse TXT file and extract text."""
        try:
            return file_bytes.decode('utf-8')
        except Exception as e:
            raise Exception(f"Error parsing TXT: {str(e)}")

    def parse_document(self, file_bytes: bytes, file_type: str) -> Optional[str]:
        """Parse document based on file type."""
        if file_type.lower() == '.pdf':
            return self.parse_pdf(file_bytes)
        elif file_type.lower() == '.docx':
            return self.parse_docx(file_bytes)
        elif file_type.lower() == '.txt':
            return self.parse_txt(file_bytes)
        else:
            raise ValueError(f"Unsupported file format. Supported formats: {self.supported_formats}")
            
    # For backward compatibility
    def parse_resume(self, file_bytes: bytes, file_type: str) -> Optional[str]:
        """Parse resume based on file type (alias for parse_document)."""
        return self.parse_document(file_bytes, file_type)
