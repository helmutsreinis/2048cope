// Utility to import textures using Vite's import.meta.glob
// This approach is more reliable than URL paths

// Use Vite's glob import to get all texture files - correct path pattern for public assets
const textureModules = import.meta.glob('../assets/textures/*.png', { eager: true });

/**
 * Get the URL for a specific tile texture - strictly maps tile-2.png to value 2
 * @param {number} value - The tile value (2, 4, 8, etc.)
 * @returns {string|null} - The URL to the texture or null if not found
 */
export function getTileTexture(value) {
  console.log('Looking for texture for value:', value);
  
  // Direct file pattern matching - ensures exact matching
  const targetFilename = `tile-${value}.png`;
  
  // Find exact match in available textures
  const matchingTexture = Object.keys(textureModules).find(path => 
    path.endsWith(targetFilename)
  );
  
  if (matchingTexture) {
    console.log(`Found exact match for tile-${value}.png at:`, matchingTexture);
    return textureModules[matchingTexture].default;
  }
  
  console.warn(`No texture found for value ${value} (looked for ${targetFilename})`);
  return null;
}

/**
 * Preload all available textures
 * @returns {Object} - Map of value to texture URL
 */
export function preloadAllTextures() {
  const textureMap = {};
  
  // Log all available textures for debugging
  console.log('Available textures:', Object.keys(textureModules));
  
  // Extract value from filename with strict pattern matching
  Object.keys(textureModules).forEach(path => {
    const match = path.match(/tile-(\d+)\.png$/);
    if (match) {
      const value = parseInt(match[1], 10);
      textureMap[value] = textureModules[path].default;
      console.log(`Mapped texture for value ${value} to:`, textureModules[path].default);
    } else {
      console.warn(`Texture at ${path} does not match required pattern "tile-{number}.png"`);
    }
  });
  
  return textureMap;
}

export default {
  getTileTexture,
  preloadAllTextures
}; 