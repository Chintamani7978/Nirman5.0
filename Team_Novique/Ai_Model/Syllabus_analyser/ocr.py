import easyocr
import os
from typing import Union
import io
from PIL import Image
import numpy as np

reader = easyocr.Reader(['en'])

def extract_text(image_input: Union[str, bytes]):
    try:
        # Convert bytes to numpy array if needed
        if isinstance(image_input, bytes):
            image = Image.open(io.BytesIO(image_input)).convert("RGB")
            image_array = np.array(image)
            result = reader.readtext(image_array)
        else:
            # Assume it's a file path
            result = reader.readtext(image_input)
        
        text = " ".join([res[1] for res in result])
        print(f"📝 Extracted text:\n{text}\n")
        return text
    except Exception as e:
        print(f"⚠️ Error extracting text: {e}")
        return ""
