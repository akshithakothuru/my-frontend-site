from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from typing import Optional
from sent_pred import analyze_sentiment

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://preview-74da53d6--market-vision-insights-hub.lovable.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input model
class SentimentRequest(BaseModel):
    ticker: str
    days_range: int = 30
    max_articles: int = 50
    newsapi_key: Optional[str] = None
    show_debug: bool = True

# Output model
class SentimentResponse(BaseModel):
    date: str
    sentiment_score: float
    headline: str
    confidence: float
    url: str

@app.get("/")
def read_root():
    return {"message": "Sentiment Analysis API"}

@app.post("/analyze-sentiment", response_model=list[SentimentResponse])
async def run_sentiment_analysis(request: SentimentRequest):
    try:
        text_data = analyze_sentiment(
            ticker=request.ticker,
            days_range=request.days_range,
            max_articles=request.max_articles,
            newsapi_key=request.newsapi_key,
            show_debug=request.show_debug
        )
        
        if text_data is None or text_data.empty:
            raise HTTPException(status_code=404, detail="No sentiment data found")
        
        results = text_data.to_dict(orient="records")
        return results
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)