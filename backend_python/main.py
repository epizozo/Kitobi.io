from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import cv2
import numpy as np
import torch
import io
from PIL import Image
import base64

app = FastAPI(title="AfriEnhance AI Backend")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Placeholder for Deep Learning Models
# In a real scenario, you would load your weights here
# model_dncnn = load_dncnn_model("weights/dncnn.pth")
# model_sr = load_realesrgan_model("weights/realesrgan.pth")

def process_image_task(image_bytes: bytes, settings: dict):
    """
    Heavy lifting image processing task (Async)
    """
    # 1. Convert bytes to OpenCV format
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # 2. Apply Denoising (DnCNN logic simulation)
    # if settings.get("denoise"):
    #    img = apply_dncnn(img)
    
    # 3. Apply Super-Resolution (Real-ESRGAN simulation)
    # if settings.get("upscale"):
    #    img = apply_realesrgan(img)
    
    # 4. Adaptive Histogram Equalization (AHE)
    if settings.get("contrast_enhancement"):
        lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        cl = clahe.apply(l)
        limg = cv2.merge((cl,a,b))
        img = cv2.cvtColor(limg, cv2.COLOR_LAB2BGR)
        
    # 5. Sharpening (Laplacian)
    if settings.get("sharpen"):
        kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
        img = cv2.filter2D(img, -1, kernel)

    # 6. Encode back to base64
    _, buffer = cv2.imencode('.jpg', img, [int(cv2.IMWRITE_JPEG_QUALITY), 85])
    return base64.b64encode(buffer).decode('utf-8')

@app.post("/enhance")
async def enhance_image(file: UploadFile = File(...), settings: str = "{}"):
    import json
    settings_dict = json.loads(settings)
    contents = await file.read()
    
    # In a real production app, you might use a task queue like Celery
    # but for FastAPI simplicity we can use BackgroundTasks or direct await
    enhanced_base64 = process_image_task(contents, settings_dict)
    
    return {
        "status": "success",
        "enhanced_image": f"data:image/jpeg;base64,{enhanced_base64}"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
