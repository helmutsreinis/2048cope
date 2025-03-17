// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Grid2D from './Grid2D';
import ScoreDisplay from './ScoreDisplay';
import Controls from './Controls';
import ChatStream from './ChatStream';
import DifficultySelector, { Difficulty, DIFFICULTIES } from './DifficultySelector';
import SkillTree, { SkillTreeState, getInitialSkillTreeState } from './SkillTree';
import useSwipeGesture from '../hooks/useSwipeGesture';
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
  const gameContainerRef = useRef(null);
  const prevBackgroundRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Difficulty and skill tree states
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [showDifficultySelector, setShowDifficultySelector] = useState(true);
  const [showSkillTree, setShowSkillTree] = useState(false);
  const [skillTreeState, setSkillTreeState] = useState<SkillTreeState>(getInitialSkillTreeState());
  const [skillPoints, setSkillPoints] = useState(0);
  
  // Track score accumulated since last skill point
  const [scoreTowardsSkillPoint, setScoreTowardsSkillPoint] = useState(0);
  
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
  
  // Handle difficulty selection
  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    addChatMessage(`Selected difficulty: ${difficulty.name} - ${difficulty.description}`);
  };
  
  // Spend skill points
  const handleSpendSkillPoints = (points) => {
    setSkillPoints(prev => Math.max(0, prev - points));
  };

  // Update skill tree state
  const handleUpdateSkillTree = (newState) => {
    setSkillTreeState(newState);
    
    // Save skill tree to localStorage
    localStorage.setItem('skillTreeState', JSON.stringify(newState));
  };

  // Die from skill learning
  const handleSkillDeathEvent = (message) => {
    setRandomDeathMessage(message);
    setShowRandomDeath(true);
    setGameState('over');
    addChatMessage(`💀 ${message}`);
  };
  
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
    if (selectedDifficulty) {
      addChatMessage(`Difficulty: ${selectedDifficulty.name} - ${Math.round(calculateActualDeathRate() * 100)}% death chance per merge`);
    }
    updateBackground(0); // Reset background for new game
    setScoreTowardsSkillPoint(0); // Reset progress towards skill point
  }, [addChatMessage, addRandomTile, updateBackground, selectedDifficulty, calculateActualDeathRate]);
  
  // Start game with selected difficulty
  const startGame = useCallback(() => {
    if (!selectedDifficulty) {
      addChatMessage("Please select a difficulty level first!");
      return;
    }
    
    setShowDifficultySelector(false);
    initGame();
  }, [selectedDifficulty, addChatMessage, initGame]);
  
  // Calculate the actual death rate based on skills
  const calculateActualDeathRate = useCallback(() => {
    if (!selectedDifficulty) return 0;
    
    // Base death rate from difficulty
    let deathRate = selectedDifficulty.deathRate;
    
    // Apply death rate modifiers from skills
    const denySkill = skillTreeState.skills.find(s => s.id === 'deny');
    if (denySkill && denySkill.currentLevel > 0 && denySkill.deathRateModifier) {
      deathRate *= denySkill.deathRateModifier(denySkill.currentLevel);
    }
    
    return deathRate;
  }, [selectedDifficulty, skillTreeState.skills]);
  
  // Calculate score multiplier based on skills
  const calculateScoreMultiplier = useCallback(() => {
    let multiplier = 1;
    
    // Apply score multipliers from skills
    skillTreeState.skills.forEach(skill => {
      if (skill.currentLevel > 0 && skill.scoreMultiplier) {
        multiplier *= skill.scoreMultiplier(skill.currentLevel);
      }
    });
    
    return multiplier;
  }, [skillTreeState.skills]);
  
  // Check for bonus score chance
  const checkBonusScore = useCallback(() => {
    let bonus = 1;
    
    // Check for bonus score chance from Swazitruck skill
    const swaziSkill = skillTreeState.skills.find(s => s.id === 'swazi');
    if (swaziSkill && swaziSkill.currentLevel > 0 && swaziSkill.bonusScoreChance) {
      const chance = swaziSkill.bonusScoreChance(swaziSkill.currentLevel);
      if (Math.random() < chance) {
        bonus = swaziSkill.scoreBonus ? swaziSkill.scoreBonus(swaziSkill.currentLevel) : 1;
        addChatMessage(`🎉 BONUS! Swazitruck activated, score multiplied by ${bonus}x!`);
      }
    }
    
    return bonus;
  }, [skillTreeState.skills, addChatMessage]);
  
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
  
  // Check for random death on each merge based on difficulty and skills
  const checkRandomDeath = useCallback(() => {
    const deathRate = calculateActualDeathRate();
    
    if (Math.random() < deathRate) {
      const randomMessage = RANDOM_DEATH_MESSAGES[Math.floor(Math.random() * RANDOM_DEATH_MESSAGES.length)];
      setRandomDeathMessage(randomMessage);
      setShowRandomDeath(true);
      setGameState('over');
      addChatMessage(`💀 ${randomMessage} Game over!`);
      return true;
    }
    return false;
  }, [addChatMessage, calculateActualDeathRate]);
  
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
            const baseScore = mergedValue;
            
            // Apply score multiplier from skills
            const scoreMultiplier = calculateScoreMultiplier();
            
            // Check for bonus score chance
            const bonusMultiplier = checkBonusScore();
            
            // Calculate total score for this merge
            const totalScore = Math.round(baseScore * scoreMultiplier * bonusMultiplier);
            
            newScore += totalScore;
            moved = true;
            mergedTiles.add(mergedValue);
            
            // Track progress towards skill points (using base score)
            setScoreTowardsSkillPoint(prev => {
              const newTotal = prev + baseScore;
              if (newTotal >= 100) {
                // Award a skill point
                setSkillPoints(p => p + 1);
                addChatMessage("🧠 You've earned a skill point! Open the Skill Tree to use it.");
                return newTotal % 100; // Remainder towards next point
              }
              return newTotal;
            });
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
            const baseScore = mergedValue;
            
            // Apply score multiplier from skills
            const scoreMultiplier = calculateScoreMultiplier();
            
            // Check for bonus score chance
            const bonusMultiplier = checkBonusScore();
            
            // Calculate total score for this merge
            const totalScore = Math.round(baseScore * scoreMultiplier * bonusMultiplier);
            
            newScore += totalScore;
            moved = true;
            mergedTiles.add(mergedValue);
            
            // Track progress towards skill points (using base score)
            setScoreTowardsSkillPoint(prev => {
              const newTotal = prev + baseScore;
              if (newTotal >= 100) {
                // Award a skill point
                setSkillPoints(p => p + 1);
                addChatMessage("🧠 You've earned a skill point! Open the Skill Tree to use it.");
                return newTotal % 100; // Remainder towards next point
              }
              return newTotal;
            });
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
            const baseScore = mergedValue;
            
            // Apply score multiplier from skills
            const scoreMultiplier = calculateScoreMultiplier();
            
            // Check for bonus score chance
            const bonusMultiplier = checkBonusScore();
            
            // Calculate total score for this merge
            const totalScore = Math.round(baseScore * scoreMultiplier * bonusMultiplier);
            
            newScore += totalScore;
            moved = true;
            mergedTiles.add(mergedValue);
            
            // Track progress towards skill points (using base score)
            setScoreTowardsSkillPoint(prev => {
              const newTotal = prev + baseScore;
              if (newTotal >= 100) {
                // Award a skill point
                setSkillPoints(p => p + 1);
                addChatMessage("🧠 You've earned a skill point! Open the Skill Tree to use it.");
                return newTotal % 100; // Remainder towards next point
              }
              return newTotal;
            });
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
            const baseScore = mergedValue;
            
            // Apply score multiplier from skills
            const scoreMultiplier = calculateScoreMultiplier();
            
            // Check for bonus score chance
            const bonusMultiplier = checkBonusScore();
            
            // Calculate total score for this merge
            const totalScore = Math.round(baseScore * scoreMultiplier * bonusMultiplier);
            
            newScore += totalScore;
            moved = true;
            mergedTiles.add(mergedValue);
            
            // Track progress towards skill points (using base score)
            setScoreTowardsSkillPoint(prev => {
              const newTotal = prev + baseScore;
              if (newTotal >= 100) {
                // Award a skill point
                setSkillPoints(p => p + 1);
                addChatMessage("🧠 You've earned a skill point! Open the Skill Tree to use it.");
                return newTotal % 100; // Remainder towards next point
              }
              return newTotal;
            });
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
  
  // Set up swipe gesture support for mobile
  useSwipeGesture(
    gameContainerRef,
    {
      onSwipeUp: () => {
        if (gameState === 'ready') move('up');
      },
      onSwipeDown: () => {
        if (gameState === 'ready') move('down');
      },
      onSwipeLeft: () => {
        if (gameState === 'ready') move('left');
      },
      onSwipeRight: () => {
        if (gameState === 'ready') move('right');
      }
    },
    50 // Swipe threshold in pixels
  );
  
  // Clear chat messages every 10 seconds
  useEffect(() => {
    const chatClearInterval = setInterval(() => {
      setChatMessages([]);
    }, 10000); // 10 seconds
    
    return () => clearInterval(chatClearInterval);
  }, []);
  
  // Initialize the game on mount
  useEffect(() => {
    console.log("Initializing the game");
    
    // Load best score from localStorage
    const savedBestScore = localStorage.getItem('bestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
    
    // Load skill tree from localStorage if available
    const savedSkillTree = localStorage.getItem('skillTreeState');
    if (savedSkillTree) {
      try {
        const parsedSkillTree = JSON.parse(savedSkillTree);
        setSkillTreeState(parsedSkillTree);
      } catch (e) {
        console.error("Failed to parse saved skill tree:", e);
        setSkillTreeState(getInitialSkillTreeState());
      }
    }
    
    // Check if difficulty was previously selected
    const savedDifficulty = localStorage.getItem('selectedDifficulty');
    if (savedDifficulty) {
      try {
        const parsedDifficulty = JSON.parse(savedDifficulty);
        setSelectedDifficulty(parsedDifficulty);
        setShowDifficultySelector(false); // Skip difficulty selector
        initGame(); // Start game with saved difficulty
      } catch (e) {
        console.error("Failed to parse saved difficulty:", e);
      }
    }
    
  }, [initGame]);
  
  // Save best score to localStorage when it changes
  useEffect(() => {
    if (bestScore > 0) {
      localStorage.setItem('bestScore', bestScore.toString());
    }
  }, [bestScore]);

  // Save selected difficulty to localStorage
  useEffect(() => {
    if (selectedDifficulty) {
      localStorage.setItem('selectedDifficulty', JSON.stringify(selectedDifficulty));
    }
  }, [selectedDifficulty]);

  // Get background style based on current background
  const getBackgroundStyle = () => {
    if (!currentBackground) return {};
    
    return {
      background: currentBackground.color
    };
  };
  
  // Add meta viewport tag for better mobile experience
  useEffect(() => {
    // Add viewport meta tag for better mobile display if it doesn't exist
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
    
    // Detect if this is a touch device
    const detectTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    detectTouchDevice();
    
    // Prevent page scrolling when playing on mobile
    const preventScrolling = (e) => {
      if (e.target.closest('.game-container')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventScrolling, { passive: false });
    
    return () => {
      document.removeEventListener('touchmove', preventScrolling);
    };
  }, []);

  return (
    <div className={`game-container ${isTouchDevice ? 'touch-device' : ''}`} ref={gameContainerRef}>
      {/* Dynamic background */}
      <div className="game-background" style={getBackgroundStyle()} />
      
      {/* Level up indicator */}
      <div className={`level-indicator ${levelUpVisible ? 'show' : ''}`}>
        {currentBackground && `PROMOTED TO ${currentBackground.name.toUpperCase()}!`}
      </div>
      
      {/* Swipe indicator for mobile */}
      <div className="swipe-indicator">Swipe to move tiles</div>
      
      {/* Random death overlay */}
      {showRandomDeath && (
        <div className="random-death-overlay">
          <div className="random-death-message">
            <h2>💀 {randomDeathMessage} 💀</h2>
            <button onClick={initGame}>New Meatwave</button>
          </div>
        </div>
      )}
      
      {/* Difficulty selector */}
      <DifficultySelector 
        onSelect={handleSelectDifficulty}
        selectedDifficulty={selectedDifficulty}
        isVisible={showDifficultySelector}
      />
      
      {/* Skill tree */}
      <SkillTree
        skillPoints={skillPoints}
        onSpendPoints={handleSpendSkillPoints}
        skillTreeState={skillTreeState}
        onUpdateSkillTree={handleUpdateSkillTree}
        isVisible={showSkillTree}
        onClose={() => setShowSkillTree(false)}
        onDeath={handleSkillDeathEvent}
      />
      
      {/* Only show game UI if difficulty is selected */}
      {!showDifficultySelector && (
        <>
          <div className="game-header">
            <div className="title">
              <h1>SVO 3-Day Simulator</h1>
            </div>
            <div className="scores">
              <ScoreDisplay score={score} bestScore={bestScore} />
              
              {/* Skill points display */}
              <div className="skill-points-display">
                <div className="skill-points-count">
                  <span className="skill-icon">🧠</span>
                  <span>{skillPoints}</span>
                </div>
                <div className="skill-progress-container">
                  <div 
                    className="skill-progress-bar" 
                    style={{ width: `${(scoreTowardsSkillPoint / 100) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="game-controls">
            <div className="control-buttons">
              <button className="new-game-btn" onClick={initGame}>New Meatwave</button>
              <button 
                className="skill-tree-btn" 
                onClick={() => setShowSkillTree(true)}
                disabled={gameState === 'over'}
              >
                Skill Tree {skillPoints > 0 ? `(${skillPoints})` : ''}
              </button>
              <button 
                className="change-difficulty-btn" 
                onClick={() => setShowDifficultySelector(true)}
              >
                Change Difficulty
              </button>
            </div>
            
            <div className="game-state-indicator">
              <div className="difficulty-badge">
                {selectedDifficulty && (
                  <>
                    <span className="difficulty-name">{selectedDifficulty.name}</span>
                    <span className="death-chance">
                      Death chance: {Math.round(calculateActualDeathRate() * 100)}%
                    </span>
                  </>
                )}
              </div>
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
            <p>Use arrow keys or swipe to move the tiles. When two tiles with the same number touch, they merge into the next shift!</p>
          </div>

          <ChatStream messages={chatMessages} />
        </>
      )}
      
      {/* Start game button for difficulty selector */}
      {showDifficultySelector && selectedDifficulty && (
        <div className="start-game-button-container">
          <button 
            className="start-game-button"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Game2D; 