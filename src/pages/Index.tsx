
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartLine, ArrowRight, TrendingUp, FileText } from "lucide-react";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-white to-secondary py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1 text-center md:text-left space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Predictive <span className="gradient-text">Stock Analysis</span> Powered by AI
                </h1>
                <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
                  Advanced stock price predictions using hybrid ARIMA-LSTM models combined with sentiment analysis for smarter investment decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link to="/predict" className="flex items-center gap-2">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 relative">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Stock market themed illustration */}
                  <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse"></div>
                  <div className="relative bg-white rounded-xl shadow-xl p-6 card-shadow">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="font-bold text-primary">TSLA</h3>
                        <p className="text-sm text-gray-600">Tesla Inc.</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-600 font-bold">$278.14</p>
                        <p className="text-sm text-green-600">+2.35%</p>
                      </div>
                    </div>
                    
                    {/* Stylized Chart */}
                    <div className="h-32 w-full relative mb-4">
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
                      </svg>
                      
                      {/* Prediction Point */}
                      <div className="absolute right-0 top-[5px] h-4 w-4 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    
                    <div className="text-center text-xs text-gray-500">
                      Predicted growth: +3.6% in next 5 days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Advanced Stock Analysis Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6 hover-lift card-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ChartLine className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Price Prediction</h3>
                <p className="text-gray-600">
                  Hybrid ARIMA-LSTM model predicts stock prices for the next 5 trading days with high accuracy.
                </p>
              </Card>
              
              <Card className="p-6 hover-lift card-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Performance Metrics</h3>
                <p className="text-gray-600">
                  View R² score and model accuracy to understand prediction confidence and reliability.
                </p>
              </Card>
              
              <Card className="p-6 hover-lift card-shadow">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sentiment Analysis</h3>
                <p className="text-gray-600">
                  Market sentiment indicators help understand investor emotions and news impact on stock movements.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-accent">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to make data-driven investment decisions?
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Start predicting stock prices and analyzing market sentiment with our advanced AI tools.
              </p>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/predict" className="flex items-center gap-2">
                  Try Stock Prediction
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

export default Index;
