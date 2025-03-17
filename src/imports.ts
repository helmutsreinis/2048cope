// @ts-nocheck
// This file manages direct imports of tile textures

// Import all textures using Vite's import.meta.glob
const textureImports = import.meta.glob('/public/textures/tile-*.png', { eager: true });

// Debug log for available textures
console.log('Available texture imports:', textureImports);

// Parse the imported textures into a map of value -> URL
export const generateTextureMap = () => {
  const textureMap: Record<number, string> = {};
  
  // Process each imported texture
  Object.entries(textureImports).forEach(([path, module]) => {
    // Extract the value from the filename (e.g., "tile-2.png" -> 2)
    const match = path.match(/tile-(\d+)\.png$/);
    if (match && match[1]) {
      const value = parseInt(match[1], 10);
      // Store the URL directly
      textureMap[value] = module.default;
      
      console.log(`Imported texture for value ${value}: ${module.default}`);
    }
  });
  
  return textureMap;
};

// Directly access textures by URL
export const getTextureUrl = (value: number): string | null => {
  const textureMap = generateTextureMap();
  return textureMap[value] || null;
};

// Default colors for fallback
export const defaultColors: Record<number, string> = {
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