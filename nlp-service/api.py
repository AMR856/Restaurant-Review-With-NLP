from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import uvicorn

app = FastAPI()

sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

class ReviewRequest(BaseModel):
    review: str

class SentimentResponse(BaseModel):
    review: str
    sentiment: str
    confidence: float

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

@app.post("/analyze", response_model=SentimentResponse)
def analyze_sentiment(request: ReviewRequest):
    """
    Analyze sentiment of a review.
    Returns: positive or negative with confidence score
    """
    if not request.review or len(request.review.strip()) == 0:
        raise HTTPException(status_code=400, detail="Review cannot be empty")
    
    result = sentiment_pipeline(request.review)[0]
    
    label = result['label'].lower()
    confidence = round(result['score'], 4)
    
    return SentimentResponse(
        review=request.review,
        sentiment=label,
        confidence=confidence
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
  