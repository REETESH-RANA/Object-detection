from transformers import pipeline
from PIL import Image 
from typing import Dict, List

classifier = pipeline(
    "object-detection",
    model="facebook/detr-resnet-50" )


def detect_objects(image: Image.Image)-> list[Dict]:
    results = classifier(image)
    Processed_results = []
    for detection in results:
        Processed_results.append({
            "label": detection['label'],
            "score": f"{detection['score']:.2f}",
            "box": detection['box']  
        })
        
    return Processed_results
