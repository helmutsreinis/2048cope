// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Board from './Board';
import ScoreDisplay from './ScoreDisplay';
import Controls from './Controls';
import { useEmbeddedTextures } from '../hooks/useEmbeddedTextures';

// Game state management
const Game = () => {
  const [gameState, setGameState] = useState('init'); // init, ready, animating, over
  const [board, setBoard] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [is2D, setIs2D] = useState(true);
  const { textureMap, isLoading, error, defaultColors } = useEmbeddedTextures();
  
  // Initialize the game
  useEffect(() => {
    console.log("Initializing the game");
    initGame();
    
    // Load best score from localStorage
    const savedBestScore = localStorage.getItem('bestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  }, []);
  
  // Save best score to localStorage when it changes
  useEffect(() => {
    if (bestScore > 0) {
      localStorage.setItem('bestScore', bestScore.toString());
    }
  }, [bestScore]);
  
  // Initialize a new game
  const initGame = useCallback(() => {
    console.log("Creating new game");
    
    // Create empty board
    const emptyBoard = Array(4).fill().map(() => 
      Array(4).fill().map(() => ({ value: 0, mergedFrom: null, isNew: false }))
    );
    
    // Add two initial tiles
    const boardWithTiles = addRandomTile(addRandomTile(emptyBoard));
    
    setBoard(boardWithTiles);
    setScore(0);
    setGameState('ready');
  }, []);
  
  // Add a random tile to the board (2 or 4)
  const addRandomTile = useCallback((board) => {
    const emptyCells = [];
    
    // Find all empty cells
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.value === 0) {
          emptyCells.push({ i, j });
        }
      });
    });
    
    if (emptyCells.length === 0) return board;
    
    // Pick a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
    
    // Create a new board with the random tile
    const newBoard = board.map((row, i) => 
      row.map((cell, j) => {
        if (i === randomCell.i && j === randomCell.j) {
          return { value: newValue, mergedFrom: null, isNew: true };
        }
        return { ...cell };
      })
    );
    
    return newBoard;
  }, []);
  
  // Handle game moves (up, down, left, right)
  const move = useCallback((direction) => {
    if (gameState !== 'ready') return;
    
    console.log(`Moving ${direction}`);
    setGameState('animating');
    
    // Clone the board to avoid mutating state directly
    let newBoard = board.map(row => row.map(cell => ({ ...cell, isNew: false, mergedFrom: null })));
    let moved = false;
    let newScore = score;
    
    // Process the move based on direction
    switch (direction) {
      case 'up':
        // Process columns from top to bottom
        for (let j = 0; j < 4; j++) {
          for (let i = 1; i < 4; i++) {
            if (newBoard[i][j].value !== 0) {
              let row = i;
              while (row > 0) {
                // If the cell above is empty, move up
                if (newBoard[row - 1][j].value === 0) {
                  newBoard[row - 1][j] = newBoard[row][j];
                  newBoard[row][j] = { value: 0, mergedFrom: null, isNew: false };
                  row--;
                  moved = true;
                }
                // If the cell above has the same value, merge
                else if (newBoard[row - 1][j].value === newBoard[row][j].value && 
                         !newBoard[row - 1][j].mergedFrom) {
                  const mergedValue = newBoard[row][j].value * 2;
                  newBoard[row - 1][j] = { 
                    value: mergedValue, 
                    mergedFrom: [row, j], 
                    isNew: false 
                  };
                  newBoard[row][j] = { value: 0, mergedFrom: null, isNew: false };
                  newScore += mergedValue;
                  moved = true;
                  break;
                }
                else {
                  break;
                }
              }
            }
          }
        }
        break;
        
      case 'down':
        // Process columns from bottom to top
        for (let j = 0; j < 4; j++) {
          for (let i = 2; i >= 0; i--) {
            if (newBoard[i][j].value !== 0) {
              let row = i;
              while (row < 3) {
                // If the cell below is empty, move down
                if (newBoard[row + 1][j].value === 0) {
                  newBoard[row + 1][j] = newBoard[row][j];
                  newBoard[row][j] = { value: 0, mergedFrom: null, isNew: false };
                  row++;
                  moved = true;
                }
                // If the cell below has the same value, merge
                else if (newBoard[row + 1][j].value === newBoard[row][j].value && 
                         !newBoard[row + 1][j].mergedFrom) {
                  const mergedValue = newBoard[row][j].value * 2;
                  newBoard[row + 1][j] = { 
                    value: mergedValue, 
                    mergedFrom: [row, j], 
                    isNew: false 
                  };
                  newBoard[row][j] = { value: 0, mergedFrom: null, isNew: false };
                  newScore += mergedValue;
                  moved = true;
                  break;
                }
                else {
                  break;
                }
              }
            }
          }
        }
        break;
        
      case 'left':
        // Process rows from left to right
        for (let i = 0; i < 4; i++) {
          for (let j = 1; j < 4; j++) {
            if (newBoard[i][j].value !== 0) {
              let col = j;
              while (col > 0) {
                // If the cell to the left is empty, move left
                if (newBoard[i][col - 1].value === 0) {
                  newBoard[i][col - 1] = newBoard[i][col];
                  newBoard[i][col] = { value: 0, mergedFrom: null, isNew: false };
                  col--;
                  moved = true;
                }
                // If the cell to the left has the same value, merge
                else if (newBoard[i][col - 1].value === newBoard[i][col].value && 
                         !newBoard[i][col - 1].mergedFrom) {
                  const mergedValue = newBoard[i][col].value * 2;
                  newBoard[i][col - 1] = { 
                    value: mergedValue, 
                    mergedFrom: [i, col], 
                    isNew: false 
                  };
                  newBoard[i][col] = { value: 0, mergedFrom: null, isNew: false };
                  newScore += mergedValue;
                  moved = true;
                  break;
                }
                else {
                  break;
                }
              }
            }
          }
        }
        break;
        
      case 'right':
        // Process rows from right to left
        for (let i = 0; i < 4; i++) {
          for (let j = 2; j >= 0; j--) {
            if (newBoard[i][j].value !== 0) {
              let col = j;
              while (col < 3) {
                // If the cell to the right is empty, move right
                if (newBoard[i][col + 1].value === 0) {
                  newBoard[i][col + 1] = newBoard[i][col];
                  newBoard[i][col] = { value: 0, mergedFrom: null, isNew: false };
                  col++;
                  moved = true;
                }
                // If the cell to the right has the same value, merge
                else if (newBoard[i][col + 1].value === newBoard[i][col].value && 
                         !newBoard[i][col + 1].mergedFrom) {
                  const mergedValue = newBoard[i][col].value * 2;
                  newBoard[i][col + 1] = { 
                    value: mergedValue, 
                    mergedFrom: [i, col], 
                    isNew: false 
                  };
                  newBoard[i][col] = { value: 0, mergedFrom: null, isNew: false };
                  newScore += mergedValue;
                  moved = true;
                  break;
                }
                else {
                  break;
                }
              }
            }
          }
        }
        break;
        
      default:
        break;
    }
    
    // If the board changed, add a new random tile
    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      
      // Update best score if needed
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
      
      // Check if game is over
      if (isGameOver(newBoard)) {
        setGameState('over');
      }
    } else {
      setGameState('ready');
    }
  }, [board, gameState, score, bestScore, addRandomTile]);
  
  // Check if the game is over (no more moves possible)
  const isGameOver = useCallback((board) => {
    // Check for empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j].value === 0) return false;
      }
    }
    
    // Check for possible merges horizontally
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j].value === board[i][j + 1].value) return false;
      }
    }
    
    // Check for possible merges vertically
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j].value === board[i + 1][j].value) return false;
      }
    }
    
    return true;
  }, []);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'ready') return;
      
      switch (e.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, move]);
  
  // Toggle between 2D and 3D views
  const toggleView = useCallback(() => {
    setIs2D(!is2D);
  }, [is2D]);
  
  if (isLoading) {
    return <div className="loading">Loading textures...</div>;
  }
  
  if (error) {
    console.warn("Texture loading error:", error);
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="title">
          <h1>2048 3D</h1>
        </div>
        <div className="scores">
          <ScoreDisplay score={score} bestScore={bestScore} />
        </div>
      </div>
      
      <div className="game-controls">
        <Controls 
          onNewGame={initGame} 
          onToggleView={toggleView} 
          is2D={is2D}
          gameState={gameState}
        />
        
        {gameState === 'over' && (
          <div className="game-over">
            <h2>Game Over!</h2>
            <button onClick={initGame}>Try Again</button>
          </div>
        )}
      </div>
      
      <div className="game-board">
        <Canvas shadows>
          <PerspectiveCamera 
            makeDefault 
            position={is2D ? [0, 5, 0] : [3, 3, 3]} 
            rotation={is2D ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
            fov={45}
          />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {board && (
            <Board 
              board={board} 
              textureMap={textureMap}
              setGameState={setGameState}
            />
          )}
          
          {!is2D && <OrbitControls enableZoom={true} enablePan={false} />}
        </Canvas>
      </div>
      
      <div className="game-instructions">
        <p>Use arrow keys to move the tiles. When two tiles with the same number touch, they merge into one!</p>
        <p>Press the "3D/2D" button to toggle between views.</p>
      </div>
    </div>
  );
};

export default Game; 