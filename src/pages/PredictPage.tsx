
import React, { useState, useEffect } from 'react';
import { ChartLine, ArrowRight, BarChart } from "lucide-react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

const stockOptions = [
  { value: 'MSFT', label: 'Microsoft (MSFT)' },
  { value: 'TSLA', label: 'Tesla (TSLA)' },
  { value: 'AAPL', label: 'Apple (AAPL)' },
  { value: 'NFLX', label: 'Netflix (NFLX)' },
  { value: 'GOOGL', label: 'Google (GOOGL)' },
  { value: 'AMZN', label: 'Amazon (AMZN)' }
];

// Example sentiment scores for demo
const sentimentScores = {
  'MSFT': { score: 0.72, label: 'Positive', color: 'success' },
  'TSLA': { score: 0.48, label: 'Neutral', color: 'accent' },
  'AAPL': { score: 0.84, label: 'Very Positive', color: 'success' },
  'NFLX': { score: 0.35, label: 'Slightly Negative', color: 'destructive' },
  'GOOGL': { score: 0.62, label: 'Positive', color: 'success' },
  'AMZN': { score: 0.55, label: 'Neutral', color: 'accent' }
};

const PredictPage = () => {
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSentiment, setShowSentiment] = useState<boolean>(true);
  const [animateSentiment, setAnimateSentiment] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Animate sentiment score when stock is selected
    if (selectedStock) {
      setAnimateSentiment(true);
    }
  }, [selectedStock]);

  const handleStockSelect = (value: string) => {
    setSelectedStock(value);
    setShowSentiment(true);
  };

  const handlePredict = () => {
    if (!selectedStock) {
      toast({
        title: "Selection Required",
        description: "Please select a stock to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      // Store selected stock in session storage for results page
      sessionStorage.setItem('predictedStock', selectedStock);
      navigate('/results');
    }, 2500);
  };

  const getSentimentColor = (stock: string) => {
    const sentiment = sentimentScores[stock as keyof typeof sentimentScores];
    if (sentiment.score >= 0.7) return 'text-success success-glow';
    if (sentiment.score >= 0.5) return 'text-primary neon-glow';
    if (sentiment.score >= 0.4) return 'text-accent accent-glow';
    return 'text-destructive';
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow">
        <section className="container px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 animate-slide-down">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Stock Price Prediction</h1>
              <p className="text-lg text-muted-foreground">
                Select a stock to analyze market sentiment and generate price predictions.
              </p>
            </div>
            
            <Card className="glass-card p-8 animate-scale-in">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Stock Ticker</label>
                  <Select value={selectedStock} onValueChange={handleStockSelect}>
                    <SelectTrigger className="w-full bg-secondary border-primary/30 hover:border-primary focus:border-primary transition-all">
                      <SelectValue placeholder="Select a stock..." />
                    </SelectTrigger>
                    <SelectContent className="bg-secondary border-primary/30 text-foreground">
                      {stockOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="hover:bg-muted focus:bg-muted">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedStock && showSentiment && (
                  <div className="bg-secondary/50 border border-border rounded-lg p-4 animate-slide-up">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          <BarChart className="h-5 w-5 text-accent" />
                          Market Sentiment Analysis
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Real-time sentiment for prediction input
                        </p>
                      </div>
                      <div className={`text-right ${getSentimentColor(selectedStock)}`}>
                        <div className="text-xl font-bold">
                          {sentimentScores[selectedStock as keyof typeof sentimentScores].label}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">Sentiment Score</p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            sentimentScores[selectedStock as keyof typeof sentimentScores].score >= 0.7 ? 'bg-success' :
                            sentimentScores[selectedStock as keyof typeof sentimentScores].score >= 0.5 ? 'bg-primary' :
                            sentimentScores[selectedStock as keyof typeof sentimentScores].score >= 0.4 ? 'bg-accent' : 'bg-destructive'
                          } transition-all duration-1000 ease-out`}
                          style={{ 
                            width: animateSentiment ? 
                              `${sentimentScores[selectedStock as keyof typeof sentimentScores].score * 100}%` : '0%' 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>Negative</span>
                        <span>Neutral</span>
                        <span>Positive</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-xs text-muted-foreground border-t border-border pt-2">
                      <p>
                        The sentiment score represents market mood and news sentiment,
                        which influences our hybrid prediction model.
                      </p>
                    </div>
                  </div>
                )}

                {selectedStock && (
                  <div className="bg-secondary/50 border border-border rounded-lg p-4 animate-slide-up">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{selectedStock}</h3>
                        <p className="text-sm text-muted-foreground">
                          {stockOptions.find(s => s.value === selectedStock)?.label.split(' ')[0]}
                        </p>
                      </div>
                      <div>
                        <ChartLine className="h-8 w-8 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground">
                      <p>The hybrid prediction model will integrate:</p>
                      <ul className="list-disc list-inside pl-2 mt-2 space-y-1">
                        <li>Market sentiment analysis</li>
                        <li>ARIMA statistical forecasting</li>
                        <li>LSTM deep learning predictions</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handlePredict} 
                  className={`w-full hover:brightness-110 transition-all ${
                    selectedStock ? 'bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20' : 'bg-muted'
                  }`}
                  disabled={isLoading || !selectedStock}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing Prediction Model...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Generate Price Predictions</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            </Card>

            <div className="mt-8 text-center text-sm text-muted-foreground animate-fade-in">
              <p className="mb-2">Our prediction model uses sentiment analysis as a key input variable.</p>
              <p>Results will include forecasted prices, accuracy metrics, and confidence intervals.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PredictPage;
