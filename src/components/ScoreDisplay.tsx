// @ts-nocheck
import React from 'react';
import '../styles/ScoreDisplay.css';

const ScoreDisplay = ({ score, bestScore }) => {
  return (
    <div className="score-container">
      <div className="score-box">
        <div className="score-label">SCORE</div>
        <div className="score-value">{score}</div>
      </div>
      <div className="score-box">
        <div className="score-label">BEST</div>
        <div className="score-value">{bestScore}</div>
      </div>
    </div>
  );
};

export default ScoreDisplay; 