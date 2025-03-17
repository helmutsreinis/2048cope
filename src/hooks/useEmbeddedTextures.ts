// @ts-nocheck
import { useState, useEffect } from 'react';
import { generateTextureMap, defaultColors } from '../imports';

/**
 * Hook for managing embedded textures in the game.
 * This replaces the uploadable texture functionality with pre-defined textures.
 */
export const useEmbeddedTextures = () => {
  const [textureMap, setTextureMap] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load and verify all textures on component mount
  useEffect(() => {
    const loadTextures = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Loading textures via direct imports...");
        
        // Get textures from direct imports
        const directImportMap = generateTextureMap();
        console.log("Direct import texture map:", directImportMap);
        
        if (Object.keys(directImportMap).length > 0) {
          console.log("Successfully loaded textures via direct imports");
          setTextureMap(directImportMap);
        } else {
          console.error("No textures found via direct imports");
          setError("Failed to load textures. Using default colors.");
          setTextureMap({});
        }
        
        setIsLoading(false);
      } catch (e) {
        console.error("Exception when loading textures:", e);
        setError("Failed to load textures");
        setIsLoading(false);
      }
    };
    
    loadTextures();
  }, []);

  return {
    textureMap,
    isLoading,
    error,
    defaultColors
  };
}; 