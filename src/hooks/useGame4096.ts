import { useState, useEffect, useCallback } from 'react';
import { GameState, Direction } from '../types';

// Initial empty board
const createEmptyBoard = (): number[][] => {
  return Array(4).fill(0).map(() => Array(4).fill(0));
};

// Add a random tile (2 or 4) to an empty cell
const addRandomTile = (board: number[][]): number[][] => {
  const newBoard = JSON.parse(JSON.stringify(board));
  const emptyCells: [number, number][] = [];
  
  // Find all empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (newBoard[i][j] === 0) {
        emptyCells.push([i, j]);
      }
    }
  }
  
  if (emptyCells.length === 0) return newBoard;
  
  // Choose a random empty cell
  const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  
  // Add a 2 (90% chance) or 4 (10% chance)
  newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
  
  return newBoard;
};

// Check if the game is over (no more moves possible)
const isGameOver = (board: number[][]): boolean => {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) return false;
    }
  }
  
  // Check for possible merges horizontally
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === board[i][j + 1]) return false;
    }
  }
  
  // Check for possible merges vertically
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === board[i + 1][j]) return false;
    }
  }
  
  return true;
};

// Check if the player has won (reached 4096)
const hasWon = (board: number[][]): boolean => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 4096) return true;
    }
  }
  return false;
};

export const useGame4096 = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    score: 0,
    gameOver: false,
    won: false
  });
  
  // Initialize the game
  const initGame = useCallback(() => {
    let newBoard = createEmptyBoard();
    // Add two random tiles to start
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    
    setGameState({
      board: newBoard,
      score: 0,
      gameOver: false,
      won: false
    });
  }, []);
  
  // Move tiles in a direction
  const moveTiles = useCallback((direction: Direction): boolean => {
    if (gameState.gameOver) return false;
    
    const { board, score } = gameState;
    let newBoard = JSON.parse(JSON.stringify(board));
    let newScore = score;
    let moved = false;
    
    // Helper function to move a row or column
    const move = (line: number[]): [number[], number, boolean] => {
      // Remove zeros
      const nonZeros = line.filter(cell => cell !== 0);
      let scoreIncrease = 0;
      let hasMoved = nonZeros.length !== line.length;
      
      // Merge tiles
      for (let i = 0; i < nonZeros.length - 1; i++) {
        if (nonZeros[i] === nonZeros[i + 1]) {
          nonZeros[i] *= 2;
          scoreIncrease += nonZeros[i];
          nonZeros.splice(i + 1, 1);
          hasMoved = true;
        }
      }
      
      // Fill with zeros
      const result = [...nonZeros, ...Array(4 - nonZeros.length).fill(0)];
      return [result, scoreIncrease, hasMoved];
    };
    
    // Process each row or column based on direction
    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const [newRow, scoreIncrease, hasMoved] = move(newBoard[i]);
        if (hasMoved) {
          newBoard[i] = newRow;
          newScore += scoreIncrease;
          moved = true;
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const [newRow, scoreIncrease, hasMoved] = move([...newBoard[i]].reverse());
        if (hasMoved) {
          newBoard[i] = newRow.reverse();
          newScore += scoreIncrease;
          moved = true;
        }
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        const [newColumn, scoreIncrease, hasMoved] = move(column);
        if (hasMoved) {
          for (let i = 0; i < 4; i++) {
            newBoard[i][j] = newColumn[i];
          }
          newScore += scoreIncrease;
          moved = true;
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        const column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]].reverse();
        const [newColumn, scoreIncrease, hasMoved] = move(column);
        if (hasMoved) {
          const reversedColumn = newColumn.reverse();
          for (let i = 0; i < 4; i++) {
            newBoard[i][j] = reversedColumn[i];
          }
          newScore += scoreIncrease;
          moved = true;
        }
      }
    }
    
    // If tiles moved, add a new random tile
    if (moved) {
      newBoard = addRandomTile(newBoard);
      const gameOver = isGameOver(newBoard);
      const won = hasWon(newBoard);
      
      setGameState({
        board: newBoard,
        score: newScore,
        gameOver,
        won
      });
    }
    
    return moved;
  }, [gameState]);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;
      
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          moveTiles('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveTiles('down');
          break;
        case 'ArrowLeft':
          e.preventDefault();
          moveTiles('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          moveTiles('right');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, moveTiles]);
  
  // Initialize the game on first render
  useEffect(() => {
    initGame();
  }, [initGame]);
  
  return {
    gameState,
    moveTiles,
    resetGame: initGame
  };
}; 