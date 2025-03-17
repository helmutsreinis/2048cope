// Simple utility to generate tile textures with embedded values
// This is not meant to be run in the browser but as a Node.js script

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Default colors for each value
const defaultColors = {
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
  4096: '#3c3a32'
};

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, '../../public/textures');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Generate a texture for each value
Object.entries(defaultColors).forEach(([value, color]) => {
  // Create a canvas of the desired size
  const canvas = createCanvas(256, 256);
  const ctx = canvas.getContext('2d');
  
  // Fill background with the tile color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 256, 256);
  
  // Add a subtle border
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 240, 240);
  
  // Add the number
  ctx.fillStyle = parseInt(value) > 4 ? '#ffffff' : '#776e65';
  ctx.font = value.length > 2 ? 'bold 72px Arial' : 'bold 96px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value, 128, 128);
  
  // Save the canvas as a PNG file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(outputDir, `tile-${value}.png`), buffer);
  
  console.log(`Generated texture for value ${value}`);
});

console.log('All textures generated successfully!'); 