from pdf2image import convert_from_path
import pytesseract
from ocr.preprocess import preprocess_image

def run_ocr_on_pdf(pdf_path: str) -> str:
    images = convert_from_path(pdf_path, dpi=300)
    full_text = ""

    for image in images:
        processed = preprocess_image(image)
        text = pytesseract.image_to_string(
            processed,
            config="--oem 3 --psm 6"
        )
        full_text += text + "\n"

    return full_text.strip()
