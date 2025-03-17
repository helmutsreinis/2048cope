// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { getTileTexture } from '../utils/importTextures';
import '../styles/Tile2D.css';

// Map of values to background colors (used as fallback)
const TILE_COLORS = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
  4096: '#3c3a32',
  8192: '#2a2a22',
};

// Map of values to text colors
const TEXT_COLORS = {
  2: '#776e65',
  4: '#776e65',
  8: '#f9f6f2',
  16: '#f9f6f2',
  32: '#f9f6f2',
  64: '#f9f6f2',
  128: '#f9f6f2',
  256: '#f9f6f2',
  512: '#f9f6f2',
  1024: '#f9f6f2',
  2048: '#f9f6f2',
  4096: '#f9f6f2',
  8192: '#f9f6f2',
};

const Tile2D = ({ position, value, isNew, isMerging }) => {
  const [row, col] = position;
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [texturePath, setTexturePath] = useState('');
  
  // Try to load texture using Vite's import mechanism
  useEffect(() => {
    if (value === 0) return;
    
    // Reset texture state when value changes
    setTextureLoaded(false);
    setTexturePath('');
    
    // Try to get texture using import utility - ensures strict matching
    const texture = getTileTexture(value);
    if (texture) {
      console.log(`Setting texture for value ${value}:`, texture);
      setTexturePath(texture);
      setTextureLoaded(true);
    } else {
      // Fallback to manual texture loading with exact naming pattern
      loadExactTexture(value);
    }
  }, [value]);
  
  // Function to load texture with exact naming pattern
  const loadExactTexture = (tileValue) => {
    // Only load texture with exact name match
    const exactPath = `assets/textures/tile-${tileValue}.png`;
    console.log(`Trying to load texture with exact match: ${exactPath}`);
    
    const img = new Image();
    img.onload = () => {
      console.log(`Successfully loaded texture for value ${tileValue}`);
      setTextureLoaded(true);
      setTexturePath(exactPath);
    };
    img.onerror = () => {
      console.warn(`No texture found for value ${tileValue}, using color fallback`);
      setTextureLoaded(false);
    };
    img.src = exactPath;
  };
  
  const tileClassName = `tile tile-${value} ${isNew ? 'tile-new' : ''} ${isMerging ? 'tile-merge' : ''}`;
  
  const style = {
    top: `calc(${row} * (var(--cell-size) + var(--grid-spacing)) + var(--grid-spacing))`,
    left: `calc(${col} * (var(--cell-size) + var(--grid-spacing)) + var(--grid-spacing))`,
    backgroundColor: TILE_COLORS[value] || '#cdc1b4',
    color: TEXT_COLORS[value] || '#776e65',
    ...(textureLoaded && texturePath && {
      backgroundImage: `url('${texturePath}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    })
  };
  
  return (
    <div className={tileClassName} style={style}>
      <div className="tile-inner">{!textureLoaded && value}</div>
    </div>
  );
};

export default Tile2D; 