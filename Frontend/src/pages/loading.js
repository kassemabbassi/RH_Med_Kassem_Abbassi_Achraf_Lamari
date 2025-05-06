import React, { useEffect, useState } from "react";
import "../styles/animation.css";

const loading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g., 3 seconds)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {loading ? (
        <div className="loader">
          <div className="letter">ISIMM</div>
        </div>
      ) : (
        <div className="content">
          <h1>Welcome to Lusion</h1>
        </div>
      )}
    </div>
  );
};

export default loading;
