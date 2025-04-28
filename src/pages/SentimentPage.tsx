
import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from "lucide-react";

const SentimentPage = () => {
  const [currentStock] = useState(() => {
    return sessionStorage.getItem('predictedStock') || 'AAPL';
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gradient-to-br from-white to-secondary">
        <section className="container px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Button asChild variant="outline" className="mb-4">
                <Link to="/results" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Results
                </Link>
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Market Sentiment Analysis
              </h1>
              <p className="text-lg text-gray-600">
                Understanding market sentiment for better investment decisions
              </p>
            </div>
            
            <Card className="p-6 card-shadow mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold">
                  {currentStock} Sentiment Overview
                </h2>
              </div>
              
              <div className="bg-secondary p-6 rounded-md mb-8">
                <div className="text-center mb-8">
                  <p className="text-lg mb-2">Overall Sentiment</p>
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium">
                    Positive
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">News Sentiment</h3>
                    <div className="text-2xl font-bold text-green-600">76%</div>
                    <p className="text-xs text-gray-500">Based on recent news articles</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Social Media</h3>
                    <div className="text-2xl font-bold text-blue-600">63%</div>
                    <p className="text-xs text-gray-500">Twitter & Reddit analysis</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Analyst Opinions</h3>
                    <div className="text-2xl font-bold text-green-600">81%</div>
                    <p className="text-xs text-gray-500">From financial analysts</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
                <div className="mb-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-primary opacity-50" />
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">Sentiment Analysis Charts Coming Soon</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-4">
                  This section will soon display detailed sentiment analysis graphs, trends, and key topics affecting your selected stocks.
                </p>
                <p className="text-sm text-gray-500">
                  Feature under development - Check back later!
                </p>
              </div>
            </Card>
            
            <div className="bg-white p-6 rounded-lg card-shadow">
              <h3 className="text-xl font-semibold mb-4">What is Sentiment Analysis?</h3>
              <p className="text-gray-700 mb-4">
                Sentiment analysis uses natural language processing and machine learning to identify and extract subjective information from text sources like news articles, social media posts, and analyst reports.
              </p>
              <p className="text-gray-700 mb-2">
                By analyzing market sentiment alongside price predictions, investors can gain deeper insights into potential stock movements based on both technical analysis and market psychology.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 text-sm">
                <div className="flex-1 p-4 bg-secondary rounded-md">
                  <h4 className="font-medium mb-2">Positive Sentiment</h4>
                  <p className="text-gray-600">Often correlates with upward price movements and investor confidence</p>
                </div>
                <div className="flex-1 p-4 bg-secondary rounded-md">
                  <h4 className="font-medium mb-2">Negative Sentiment</h4>
                  <p className="text-gray-600">May indicate upcoming market corrections or downward trends</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SentimentPage;
