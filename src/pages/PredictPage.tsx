
import React, { useState } from 'react';
import { ChartLine, ArrowRight } from "lucide-react";
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

const PredictPage = () => {
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStockSelect = (value: string) => {
    setSelectedStock(value);
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
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-white to-secondary">
        <section className="container px-4 py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Stock Price Prediction</h1>
              <p className="text-lg text-gray-600">
                Select a stock ticker to generate price predictions for the next 5 trading days.
              </p>
            </div>
            
            <Card className="p-8 card-shadow">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Select Stock Ticker</label>
                  <Select value={selectedStock} onValueChange={handleStockSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a stock..." />
                    </SelectTrigger>
                    <SelectContent>
                      {stockOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedStock && (
                  <div className="bg-secondary p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{selectedStock}</h3>
                        <p className="text-sm text-gray-600">
                          {stockOptions.find(s => s.value === selectedStock)?.label.split(' ')[0]}
                        </p>
                      </div>
                      <div>
                        <ChartLine className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                      <p>The prediction will use a hybrid ARIMA-LSTM model to analyze historical price patterns and predict future movements.</p>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handlePredict} 
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading || !selectedStock}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating Predictions...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>Generate Predictions</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            </Card>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Our prediction model uses historical data and advanced machine learning techniques.</p>
              <p>Results will include price forecasts and model accuracy metrics.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PredictPage;
