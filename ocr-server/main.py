from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from ocr.pdf_text import extract_text_from_pdf
from ocr.tesseract import run_ocr_on_pdf
from ocr.clean import clean_text

from PIL import Image
import pytesseract
import os
import tempfile

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://understand-televisions-brother-category.trycloudflare.com/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Status":200,"message":f"Server is running at port 8000"}


@app.post("/ocr")
async def ocr_resume(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename)[-1].lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    text = ""

    try:
        if suffix in [".png", ".jpg", ".jpeg"]:
            img = Image.open(tmp_path)
            text = pytesseract.image_to_string(img, config="--psm 6")
        else:
            text = extract_text_from_pdf(tmp_path)

        if not text or len(text.strip()) < 50:
            text = run_ocr_on_pdf(tmp_path)

    except Exception as e:
        print("OCR failed:", e)
        text = ""

    os.remove(tmp_path)

    return {"success":True,"text": clean_text(text)}

