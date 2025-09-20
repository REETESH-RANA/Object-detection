from fastapi import FastAPI,File ,UploadFile,Form
from PIL import Image,ImageStat
from analyze import detect_objects
from io import BytesIO

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Object Identifier API")

origins = [  "http://localhost:3000",  ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)
 

@app.post("/analyze")
async def analyze_image(image: UploadFile = File(...)):
    img_bytes = await image.read()
    img = Image.open(BytesIO(img_bytes))

   

    result = detect_objects(img)
    return result


@app.get("/")
def read_root():
    return {"message": "Backend is running!"}