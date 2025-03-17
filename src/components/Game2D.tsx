// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Grid2D from './Grid2D';
import ScoreDisplay from './ScoreDisplay';
import Controls from './Controls';
import ChatStream from './ChatStream';
import { getRandomMessage } from '../utils/chatMessages';
import { getBackgroundForScore, preloadBackgroundImages, generateFallbackBackground } from '../utils/backgroundManager';
import '../styles/Game2D.css';

// Game state management
const Game2D = () => {
  const [gameState, setGameState] = useState('init'); // init, ready, animating, over
  const [board, setBoard] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentBackground, setCurrentBackground] = useState(null);
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const prevBackgroundRef = useRef(null);
  
  // Preload background images on component mount
  useEffect(() => {
    preloadBackgroundImages();
    updateBackground(0);
  }, []);
  
  // Update background based on score
  const updateBackground = useCallback((newScore) => {
    const background = getBackgroundForScore(newScore);
    
    // If background level changed, show level up message
    if (prevBackgroundRef.current && 
        prevBackgroundRef.current.name !== background.name) {
      setLevelUpVisible(true);
      setTimeout(() => setLevelUpVisible(false), 3000);
      
      // Add a message to the chat about leveling up
      addChatMessage(`🌟 PROMOTION! You're now a ${background.name}! 🌟`);
    }
    
    setCurrentBackground(background);
    prevBackgroundRef.current = background;
  }, []);
  
  // Log game state changes for debugging
  useEffect(() => {
    console.log("Game state changed to:", gameState);
  }, [gameState]);
  
  // Add a new chat message - moved up so it's defined before being used
  const addChatMessage = useCallback((message) => {
    setChatMessages(prev => {
      const newMessages = [
        ...prev,
        {
          id: Date.now() + Math.random().toString(36).substring(2, 9), // Ensure unique ID
          message,
          timestamp: new Date()
        }
      ].slice(-10); // Keep only the last 10 messages
      return newMessages;
    });
  }, []);
  
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
    setChatMessages([]); // Clear chat messages
    addChatMessage("🔥 New meatwave starting! Let's cook! 🧑‍🍳");
    updateBackground(0); // Reset background for new game
  }, [addChatMessage, updateBackground]);
  
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
    if (gameState !== 'ready') {
      console.log(`Move ${direction} ignored, game state is ${gameState}`);
      return;
    }
    
    console.log(`Moving ${direction}`);
    setGameState('animating');
    
    // Clone the board to avoid mutating state directly
    let newBoard = board.map(row => row.map(cell => ({ ...cell, isNew: false, mergedFrom: null })));
    let moved = false;
    let newScore = score;
    let mergedTiles = new Set(); // Track merged tile values for messages
    
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
                  mergedTiles.add(mergedValue);
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
                  mergedTiles.add(mergedValue);
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
                  mergedTiles.add(mergedValue);
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
                  mergedTiles.add(mergedValue);
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
    
    // If the board changed, add a new random tile and generate messages
    if (moved) {
      newBoard = addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      
      // Update background based on new score
      updateBackground(newScore);
      
      // Generate messages for each merged tile
      mergedTiles.forEach(value => {
        const message = getRandomMessage(value, newScore);
        addChatMessage(message);
      });
      
      // Update best score if needed
      if (newScore > bestScore) {
        setBestScore(newScore);
      }
      
      // Check if game is over
      if (isGameOver(newBoard)) {
        setGameState('over');
        addChatMessage("🔥 MEATWAVE OVER! Time to clean up! 🧹");
      }
    } else {
      // Even if no move was made, return to ready state
      setGameState('ready');
    }
  }, [board, gameState, score, bestScore, addRandomTile, addChatMessage, updateBackground]);
  
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

  // Clear chat messages every 10 seconds
  useEffect(() => {
    const chatClearInterval = setInterval(() => {
      setChatMessages([]);
    }, 30000); // 10 seconds
    
    return () => clearInterval(chatClearInterval);
  }, []);

  // Get background style based on current background
  const getBackgroundStyle = () => {
    if (!currentBackground) return {};
    
    return {
      background: currentBackground.color
    };
  };

  return (
    <div className="game-container">
      {/* Dynamic background */}
      <div className="game-background" style={getBackgroundStyle()} />
      
      {/* Level up indicator */}
      <div className={`level-indicator ${levelUpVisible ? 'show' : ''}`}>
        {currentBackground && `PROMOTED TO ${currentBackground.name.toUpperCase()}!`}
      </div>
      
      <div className="game-header">
        <div className="title">
          <h1>SVO 3-Day Simulator</h1>
        </div>
        <div className="scores">
          <ScoreDisplay score={score} bestScore={bestScore} />
        </div>
      </div>
      
      <div className="game-controls">
        <button className="new-game-btn" onClick={initGame}>New Meatwave</button>
        <div className="game-state-indicator">
          Game State: {gameState}
        </div>
        
        {gameState === 'over' && (
          <div className="game-over">
            <h2>Shift Over!</h2>
            <button onClick={initGame}>New Meatwave</button>
          </div>
        )}
      </div>
      
      <div className="game-board-2d">
        <Grid2D 
          board={board} 
          setGameState={setGameState}
        />
      </div>
      
      <div className="game-instructions">
        <p>Use arrow keys to move the tiles. When two tiles with the same number touch, they merge into the next shift!</p>
      </div>

      <ChatStream messages={chatMessages} />
    </div>
  );
};

export default Game2D; 