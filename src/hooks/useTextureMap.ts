import { useState, useCallback } from 'react';
import { TextureMapItem } from '../types';

// Default colors for each value if no texture is provided
const defaultColors: Record<number, string> = {
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

export const useTextureMap = () => {
  const [textureMap, setTextureMap] = useState<Record<number, string>>({});
  
  // Convert a value to a color or texture URL
  const getTextureOrColor = useCallback((value: number): string => {
    if (value === 0) return 'transparent';
    
    // If we have a custom texture for this value, use it
    if (textureMap[value]) {
      return textureMap[value];
    }
    
    // Otherwise use the default color
    return defaultColors[value] || '#3c3a32';
  }, [textureMap]);
  
  // Update the texture map with a new texture
  const updateTexture = useCallback((item: TextureMapItem) => {
    setTextureMap(prev => ({
      ...prev,
      [item.value]: item.imageUrl
    }));
  }, []);
  
  // Remove a texture from the map
  const removeTexture = useCallback((value: number) => {
    setTextureMap(prev => {
      const newMap = { ...prev };
      delete newMap[value];
      return newMap;
    });
  }, []);
  
  // Clear all textures
  const clearTextures = useCallback(() => {
    setTextureMap({});
  }, []);
  
  return {
    textureMap,
    getTextureOrColor,
    updateTexture,
    removeTexture,
    clearTextures
  };
}; 