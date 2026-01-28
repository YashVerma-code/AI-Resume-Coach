import re

def clean_text(text: str) -> str:
    if not text:
        return ""

    text = re.sub(r'\n{2,}', '\n', text)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    text = re.sub(r'\s+', ' ', text)

    return text.strip()
