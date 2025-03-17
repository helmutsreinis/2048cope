// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Cube from './Cube';

const Board = ({ 
  board, 
  textureMap, 
  setGameState,
  boardSize = 4
}) => {
  const [animatingCells, setAnimatingCells] = useState(new Set());
  const [newCells, setNewCells] = useState(new Set());
  const [mergingCells, setMergingCells] = useState(new Set());
  
  // Track cells with animations
  useEffect(() => {
    // Clear animation tracking
    setAnimatingCells(new Set());
    setNewCells(new Set());
    setMergingCells(new Set());
    
    if (!board) return;
    
    // Find cells with animations
    const newAnimatingCells = new Set();
    const newCellPositions = new Set();
    const mergingCellPositions = new Set();
    
    // Track cells that need animation
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const key = `${i}-${j}`;
        if (cell.isNew) {
          newCellPositions.add(key);
          newAnimatingCells.add(key);
        }
        if (cell.mergedFrom) {
          mergingCellPositions.add(key);
          newAnimatingCells.add(key);
        }
      });
    });
    
    setAnimatingCells(newAnimatingCells);
    setNewCells(newCellPositions);
    setMergingCells(mergingCellPositions);
    
    // If there are no animations, update game state immediately
    if (newAnimatingCells.size === 0) {
      setGameState('ready');
    }
  }, [board, setGameState]);
  
  // Handle animation completion
  const handleAnimationComplete = (i, j) => {
    const key = `${i}-${j}`;
    setAnimatingCells(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      
      // If all animations are done, update game state
      if (newSet.size === 0) {
        setGameState('ready');
      }
      
      return newSet;
    });
    
    // Clear animation flags
    setNewCells(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
    
    setMergingCells(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  };

  if (!board) return null;

  // Render the board with cells
  return (
    <group>
      {/* Render the grid cells */}
      {board.map((row, i) => 
        row.map((cell, j) => {
          const key = `${i}-${j}`;
          const x = j - (boardSize - 1) / 2;
          const z = i - (boardSize - 1) / 2;
          
          return (
            <Cube
              key={key}
              position={[x, 0, z]}
              value={cell.value}
              textureMap={textureMap}
              isNew={newCells.has(key)}
              isMerging={mergingCells.has(key)}
              onAnimationComplete={() => handleAnimationComplete(i, j)}
            />
          );
        })
      )}
    </group>
  );
};

export default Board; 