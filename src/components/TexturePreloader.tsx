// @ts-nocheck
import React, { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

// This component preloads textures to ensure they're available when needed
const TexturePreloader = ({ texturePaths }) => {
  useEffect(() => {
    console.log('TexturePreloader: Attempting to preload textures:', texturePaths);
    
    // Manually preload all textures
    if (texturePaths && Object.keys(texturePaths).length > 0) {
      Object.entries(texturePaths).forEach(([value, path]) => {
        const img = new Image();
        img.onload = () => console.log(`TexturePreloader: Successfully preloaded texture ${path}`);
        img.onerror = (e) => console.error(`TexturePreloader: Failed to preload texture ${path}`, e);
        img.src = path;
      });
    }
  }, [texturePaths]);

  // The loader will make sure textures are cached in the THREE.Cache
  // This is important for Three.js to properly manage textures
  if (texturePaths && Object.keys(texturePaths).length > 0) {
    try {
      // Try to load at least the first texture
      const firstTexturePath = Object.values(texturePaths)[0];
      if (firstTexturePath) {
        const texture = useLoader(TextureLoader, firstTexturePath);
        console.log('TexturePreloader: First texture loaded via useLoader:', texture);
      }
    } catch (error) {
      console.error('TexturePreloader: Error using useLoader:', error);
    }
  }

  // This component doesn't render anything
  return null;
};

export default TexturePreloader; 