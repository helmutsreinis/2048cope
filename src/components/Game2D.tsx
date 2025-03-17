// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Grid2D from './Grid2D';
import ScoreDisplay from './ScoreDisplay';
import Controls from './Controls';
import ChatStream from './ChatStream';
import { getRandomMessage } from '../utils/chatMessages';
import { getBackgroundForScore, preloadBackgroundImages, generateFallbackBackground } from '../utils/backgroundManager';
import '../styles/Game2D.css';

// List of random game over messages
const RANDOM_DEATH_MESSAGES = [
  "You got Droned...",
  "Your relatives will receive a brand new lada.",
  "Died from disentery.",
  "You woke up in mobile crematorium...",
  "Stepped on your own mine.",
  "Friendly fire isn't very friendly.",
  "Conscripted while drunk at a bar.",
  "Your trench collapsed.",
  "Should have brought your own tourniquet.",
  "Forgot to remove your geo-tagged selfie."
];

// Game state management
const Game2D = () => {
  const [gameState, setGameState] = useState('init'); // init, ready, animating, over
  const [board, setBoard] = useState(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentBackground, setCurrentBackground] = useState(null);
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [randomDeathMessage, setRandomDeathMessage] = useState("");
  const [showRandomDeath, setShowRandomDeath] = useState(false);
  const prevBackgroundRef = useRef(null);
  
  // Add a new chat message - defined early so it can be used by other functions
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
  }, [addChatMessage]);
  
  // Log game state changes for debugging
  useEffect(() => {
    console.log("Game state changed to:", gameState);
  }, [gameState]);
  
  // Add a random tile to the board (2 or 4)
  const addRandomTile = useCallback((currentBoard) => {
    const newBoard = currentBoard.map(row => [...row]);
    
    // Find all empty cells
    const emptyCells = [];
    newBoard.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.value === 0) {
          emptyCells.push({ i, j });
        }
      });
    });
    
    // If there are empty cells, add a new tile
    if (emptyCells.length > 0) {
      const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newBoard[i][j] = {
        value: Math.random() < 0.9 ? 2 : 4, // 90% chance of 2, 10% chance of 4
        isNew: true,
        mergedFrom: null
      };
    }
    
    return newBoard;
  }, []);
  
  // Check if the game is over (no more moves possible)
  const isGameOver = useCallback((currentBoard) => {
    // Check if there are empty cells
    for (let i = 0; i < currentBoard.length; i++) {
      for (let j = 0; j < currentBoard[i].length; j++) {
        if (currentBoard[i][j].value === 0) {
          return false;
        }
      }
    }
    
    // Check if there are adjacent cells with the same value
    for (let i = 0; i < currentBoard.length; i++) {
      for (let j = 0; j < currentBoard[i].length; j++) {
        const value = currentBoard[i][j].value;
        
        // Check right
        if (j < currentBoard[i].length - 1 && currentBoard[i][j + 1].value === value) {
          return false;
        }
        
        // Check down
        if (i < currentBoard.length - 1 && currentBoard[i + 1][j].value === value) {
          return false;
        }
      }
    }
    
    // No moves possible
    return true;
  }, []);
  
  // Check for random death on each merge (1% chance)
  const checkRandomDeath = useCallback(() => {
    if (Math.random() < 0.005) { // 1% chance
      const randomMessage = RANDOM_DEATH_MESSAGES[Math.floor(Math.random() * RANDOM_DEATH_MESSAGES.length)];
      setRandomDeathMessage(randomMessage);
      setShowRandomDeath(true);
      setGameState('over');
      addChatMessage(`💀 ${randomMessage} Game over!`);
      return true;
    }
    return false;
  }, [addChatMessage]);

  // Move the tiles in the specified direction
  const move = useCallback((direction) => {
    if (gameState !== 'ready') {
      console.log(`Move ${direction} ignored, game state is ${gameState}`);
      return;
    }
    
    console.log(`Moving ${direction}`);
    setGameState('animating');
    
    let newBoard = board.map(row => row.map(cell => ({ ...cell, isNew: false, mergedFrom: null })));
    let moved = false;
    let newScore = score;
    let mergedTiles = new Set(); // Track merged tile values for messages
    
    // Process the move based on direction
    if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        let column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
        let result = processTiles(column);
        
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = result[i];
          if (result[i].value !== board[i][j].value) {
            moved = true;
          }
          if (result[i].mergedFrom) {
            const mergedValue = result[i].value;
            newScore += mergedValue;
            moved = true;
            mergedTiles.add(mergedValue);
          }
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        let column = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]].reverse();
        let result = processTiles(column).reverse();
        
        for (let i = 0; i < 4; i++) {
          newBoard[i][j] = result[i];
          if (result[i].value !== board[i][j].value) {
            moved = true;
          }
          if (result[i].mergedFrom) {
            const mergedValue = result[i].value;
            newScore += mergedValue;
            moved = true;
            mergedTiles.add(mergedValue);
          }
        }
      }
    } else if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        let row = [...newBoard[i]];
        let result = processTiles(row);
        
        for (let j = 0; j < 4; j++) {
          newBoard[i][j] = result[j];
          if (result[j].value !== board[i][j].value) {
            moved = true;
          }
          if (result[j].mergedFrom) {
            const mergedValue = result[j].value;
            newScore += mergedValue;
            moved = true;
            mergedTiles.add(mergedValue);
          }
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        let row = [...newBoard[i]].reverse();
        let result = processTiles(row).reverse();
        
        for (let j = 0; j < 4; j++) {
          newBoard[i][j] = result[j];
          if (result[j].value !== board[i][j].value) {
            moved = true;
          }
          if (result[j].mergedFrom) {
            const mergedValue = result[j].value;
            newScore += mergedValue;
            moved = true;
            mergedTiles.add(mergedValue);
          }
        }
      }
    }
    
    // Helper function to process a row or column of tiles
    function processTiles(tiles) {
      const newTiles = tiles.filter(t => t.value !== 0);
      const result = Array(tiles.length).fill().map(() => ({ value: 0, isNew: false, mergedFrom: null }));
      
      let position = 0;
      for (let i = 0; i < newTiles.length; i++) {
        const current = newTiles[i];
        
        if (i < newTiles.length - 1 && newTiles[i].value === newTiles[i + 1].value) {
          result[position] = {
            value: current.value * 2,
            isNew: false,
            mergedFrom: [current, newTiles[i + 1]]
          };
          i++; // Skip the next tile because it was merged
        } else {
          result[position] = current;
        }
        position++;
      }
      
      return result;
    }
    
    // If the board changed, add a new random tile and generate messages
    if (moved) {
      // Check for random death before updating the board
      if (mergedTiles.size > 0 && checkRandomDeath()) {
        setBoard(newBoard); // Still update the board to show the last move
        setScore(newScore);
        updateBackground(newScore);
        return;
      }
      
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
      setGameState('ready');
    }
  }, [board, gameState, score, bestScore, addRandomTile, addChatMessage, updateBackground, checkRandomDeath, isGameOver]);
  
  // Process keyboard input
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
    }, 10000); // 10 seconds
    
    return () => clearInterval(chatClearInterval);
  }, []);
  
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
    setShowRandomDeath(false); // Reset random death state
    addChatMessage("🔥 New meatwave starting! Let's cook! 🧑‍🍳");
    updateBackground(0); // Reset background for new game
  }, [addChatMessage, addRandomTile, updateBackground]);
  
  // Initialize the game on mount
  useEffect(() => {
    console.log("Initializing the game");
    initGame();
    
    // Load best score from localStorage
    const savedBestScore = localStorage.getItem('bestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
  }, [initGame]);
  
  // Save best score to localStorage when it changes
  useEffect(() => {
    if (bestScore > 0) {
      localStorage.setItem('bestScore', bestScore.toString());
    }
  }, [bestScore]);

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
      
      {/* Random death overlay */}
      {showRandomDeath && (
        <div className="random-death-overlay">
          <div className="random-death-message">
            <h2>💀 {randomDeathMessage} 💀</h2>
            <button onClick={initGame}>New Meatwave</button>
          </div>
        </div>
      )}
      
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
        
        {gameState === 'over' && !showRandomDeath && (
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