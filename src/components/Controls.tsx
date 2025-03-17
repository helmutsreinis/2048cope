// @ts-nocheck
import React from 'react';

const Controls = ({ onNewGame, onToggleView, is2D, gameState }) => {
  return (
    <div className="controls-container">
      <button 
        className="control-button new-game" 
        onClick={onNewGame}
        disabled={gameState === 'animating'}
      >
        New Game
      </button>
      
      <button 
        className="control-button toggle-view"
        onClick={onToggleView}
        disabled={gameState === 'animating'}
      >
        {is2D ? '3D View' : '2D View'}
      </button>
      
      <div className="game-info">
        {gameState === 'ready' && <span className="game-status">Ready</span>}
        {gameState === 'animating' && <span className="game-status">Moving...</span>}
        {gameState === 'over' && <span className="game-status game-over">Game Over!</span>}
      </div>
    </div>
  );
};

export default Controls; 