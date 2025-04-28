
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartLine, Home, TrendingUp, FileText } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full bg-white py-4 px-6 md:px-12 shadow-sm z-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary rounded-full p-2">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">MarketVision</span>
          </Link>

          <nav className="flex flex-wrap gap-1 md:gap-2">
            <Link 
              to="/" 
              className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-accent text-sm md:text-base"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/predict" 
              className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-accent text-sm md:text-base"
            >
              <ChartLine className="h-4 w-4" />
              <span>Predict</span>
            </Link>
            <Link 
              to="/sentiment" 
              className="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-accent text-sm md:text-base"
            >
              <FileText className="h-4 w-4" />
              <span>Sentiment</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
