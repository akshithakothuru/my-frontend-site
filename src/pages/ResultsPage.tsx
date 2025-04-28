
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, ArrowRight } from "lucide-react";

interface PredictionData {
  dates: string[];
  predictions: number[];
  accuracy: number;
}

// Demo data for visualization purposes
const demoData: Record<string, PredictionData> = {
  'MSFT': {
    dates: ['2025-04-29', '2025-04-30', '2025-05-01', '2025-05-02', '2025-05-05'],
    predictions: [415.22, 418.67, 422.91, 419.88, 425.30],
    accuracy: 94.7,
  },
  'AAPL': {
    dates: ['2025-04-29', '2025-04-30', '2025-05-01', '2025-05-02', '2025-05-05'],
    predictions: [183.65, 185.22, 187.10, 186.79, 189.45],
    accuracy: 93.2,
  },
  'TSLA': {
    dates: ['2025-04-29', '2025-04-30', '2025-05-01', '2025-05-02', '2025-05-05'],
    predictions: [179.22, 172.45, 168.90, 171.32, 174.65],
    accuracy: 90.5,
  },
  'NFLX': {
    dates: ['2025-04-29', '2025-04-30', '2025-05-01', '2025-05-02', '2025-05-05'],
    predictions: [624.18, 631.45, 637.90, 629.75, 642.30],
    accuracy: 91.8,
  },
  'GOOGL': {
    dates: ['2025-04-29', '2025-04-30', '2025-05-01', '2025-05-02', '2025-05-05'],
    predictions: [173.25, 176.50, 178.75, 176.20, 179.85],
    accuracy: 92.6,
  },
  'AMZN': {
    dates: ['2025-04-29', '2025-04-30', '2025-05-01', '2025-05-02', '2025-05-05'],
    predictions: [182.35, 185.60, 188.20, 186.45, 190.75],
    accuracy: 91.9,
  },
};

const ResultsPage = () => {
  const [stock, setStock] = useState<string>("");
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get selected stock from session storage
    const selectedStock = sessionStorage.getItem('predictedStock');
    
    if (!selectedStock) {
      // If no stock was selected, redirect back to predict page
      navigate('/predict');
      return;
    }
    
    setStock(selectedStock);
    
    // Simulate loading prediction data
    setTimeout(() => {
      setPredictionData(demoData[selectedStock]);
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const getPriceChangeClass = (current: number, previous: number) => {
    const change = current - previous;
    return change >= 0 ? 'text-green-600' : 'text-red-500';
  };

  const getAccuracyColorClass = (accuracy: number) => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 90) return 'text-blue-600';
    if (accuracy >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-medium">Loading prediction results...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!predictionData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="container px-4 py-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Error Loading Results</h2>
            <p className="mb-6">We couldn't load the prediction data. Please try again.</p>
            <Button asChild>
              <Link to="/predict">Return to Prediction Page</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-white to-secondary">
        <section className="container px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button asChild variant="outline" className="mb-4">
                <Link to="/predict" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Prediction
                </Link>
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {stock} Prediction Results
              </h1>
              <p className="text-lg text-gray-600">
                5-day price forecast using hybrid ARIMA-LSTM model
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="p-6 card-shadow">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Predicted Prices
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Price ($)</th>
                        <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictionData.dates.map((date, index) => {
                        const price = predictionData.predictions[index];
                        const prevPrice = index > 0 ? predictionData.predictions[index - 1] : null;
                        const change = prevPrice ? ((price - prevPrice) / prevPrice) * 100 : null;
                        
                        return (
                          <tr key={date} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm">{date}</td>
                            <td className="py-3 px-4 text-right font-medium">${price.toFixed(2)}</td>
                            <td className={`py-3 px-4 text-right font-medium ${prevPrice ? getPriceChangeClass(price, prevPrice) : ''}`}>
                              {change !== null ? (
                                <>
                                  {change >= 0 ? '+' : ''}
                                  {change.toFixed(2)}%
                                </>
                              ) : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>Predictions are based on historical data and market trends.</p>
                </div>
              </Card>
              
              <div className="space-y-8">
                <Card className="p-6 card-shadow">
                  <h2 className="text-xl font-semibold mb-4">Model Performance</h2>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">R² Score (Accuracy)</span>
                    <span className={`text-lg font-bold ${getAccuracyColorClass(predictionData.accuracy)}`}>
                      {predictionData.accuracy}%
                    </span>
                  </div>
                  
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary"
                      style={{ width: `${predictionData.accuracy}%` }}
                    ></div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <p>
                      The R² score indicates how well the model's predictions match actual historical data.
                      Higher values represent better accuracy.
                    </p>
                  </div>
                </Card>
                
                <Card className="p-6 card-shadow">
                  <h2 className="text-xl font-semibold mb-4">Prediction Visualization</h2>
                  
                  <div className="aspect-w-16 aspect-h-9 bg-white p-4 rounded-md border border-gray-100">
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="h-40 w-full relative mb-4">
                          <svg className="w-full h-full" viewBox="0 0 100 40">
                            <path
                              d="M0,30 L10,28 L20,32 L30,25 L40,22 L50,18 L60,20 L70,15 L80,10 L90,8 L100,5"
                              fill="none"
                              stroke="#1f4e79"
                              strokeWidth="2"
                            />
                            <path
                              d="M0,30 L10,28 L20,32 L30,25 L40,22 L50,18 L60,20 L70,15 L80,10 L90,8 L100,5 V40 H0 Z"
                              fill="url(#gradient)"
                              opacity="0.2"
                            />
                            <defs>
                              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#1f4e79" />
                                <stop offset="100%" stopColor="#ffffff" />
                              </linearGradient>
                            </defs>
                            
                            {/* Actual vs Predicted markers */}
                            <circle cx="80" cy="10" r="1.5" fill="#1f4e79" />
                            <circle cx="90" cy="8" r="1.5" fill="#1f4e79" />
                            <circle cx="100" cy="5" r="1.5" fill="#1f4e79" />
                            
                            {/* Prediction markers */}
                            <circle cx="80" cy="12" r="1.5" fill="#ff6b6b" />
                            <circle cx="90" cy="9" r="1.5" fill="#ff6b6b" />
                            <circle cx="100" cy="7" r="1.5" fill="#ff6b6b" />
                          </svg>
                        </div>
                        <div className="flex justify-center space-x-6 text-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span>Actual</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <span>Predicted</span>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-gray-500">
                          Stock chart visualization: {stock}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      Actual vs. predicted stock price movements
                    </p>
                  </div>
                </Card>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center md:justify-end">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/sentiment" className="flex items-center gap-2">
                  View Sentiment Analysis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ResultsPage;
