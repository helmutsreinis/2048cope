// @ts-nocheck
import React, { useEffect, useRef } from 'react';

// A simple component to generate textures for the game
const TextureGenerator = () => {
  const canvasRef = useRef(null);
  
  // Values to generate textures for
  const values = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
  
  // Background colors for each value
  const bgColors = {
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
  
  // Text colors for each value
  const textColors = {
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
  
  // Generate textures when the component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    
    // Generate texture for each value
    values.forEach(value => {
      // Clear canvas
      ctx.clearRect(0, 0, size, size);
      
      // Draw background
      ctx.fillStyle = bgColors[value] || '#cdc1b4';
      ctx.fillRect(0, 0, size, size);
      
      // Add some subtle texture/gradient
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, size, size/2);
      
      // Draw value text
      ctx.fillStyle = textColors[value] || '#776e65';
      
      // Choose font size based on the number of digits
      let fontSize = 65;
      if (value >= 1000) {
        fontSize = 35;
      } else if (value >= 100) {
        fontSize = 45;
      }
      
      ctx.font = `bold ${fontSize}px 'Clear Sans', Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toString(), size/2, size/2);
      
      // Convert to PNG and download
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `tile-${value}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }, []);
  
  return (
    <div style={{ display: 'none' }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default TextureGenerator; 