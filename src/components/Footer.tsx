
import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-secondary py-6 px-6 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">MV</span>
            </div>
            <p>MarketVision Insights | Stock Prediction & Analysis</p>
          </div>
          <div className="text-center md:text-right">
            <p>&copy; {year} MarketVision. All rights reserved.</p>
            <p className="text-xs mt-1">Powered by AI & Machine Learning</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
