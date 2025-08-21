"use client";

import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route.");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-white/80 mb-4">Oops! Page not found</p>
        <Link to="/" className="text-primary hover:text-primary/80 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;