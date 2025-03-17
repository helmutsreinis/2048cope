// @ts-nocheck
import React, { useEffect } from 'react';
import Tile2D from './Tile2D';
import '../styles/Grid2D.css';

const Grid2D = ({ 
  board, 
  setGameState,
  boardSize = 4
}) => {
  // Monitor animation status and update game state when animations complete
  useEffect(() => {
    if (!board) return;
    
    // Check if there are any animating cells
    let hasAnimations = false;
    
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.isNew || cell.mergedFrom) {
          hasAnimations = true;
        }
      });
    });
    
    if (!hasAnimations) {
      // If no animations, set game state to ready
      setGameState('ready');
    } else {
      // If there are animations, wait for them to finish
      const animationTimeout = setTimeout(() => {
        setGameState('ready');
      }, 200); // Match animation duration in CSS
      
      return () => clearTimeout(animationTimeout);
    }
  }, [board, setGameState]);

  if (!board) return null;

  return (
    <div className="grid-container">
      <div className="grid-background">
        {Array(boardSize).fill(0).map((_, i) => (
          Array(boardSize).fill(0).map((_, j) => (
            <div key={`${i}-${j}-bg`} className="grid-cell-bg"></div>
          ))
        ))}
      </div>
      
      <div className="grid-cells">
        {board.map((row, i) => 
          row.map((cell, j) => {
            if (cell.value === 0) return null;
            
            return (
              <Tile2D
                key={`${i}-${j}`}
                position={[i, j]}
                value={cell.value}
                isNew={cell.isNew}
                isMerging={cell.mergedFrom !== null}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Grid2D; 