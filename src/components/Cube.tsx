// @ts-nocheck
import React, { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Text, Box } from '@react-three/drei';
import { defaultColors } from '../imports';

// Cube component for 3D game tiles
const Cube = ({
  position,
  value = 0,
  textureMap,
  is2D = false,
  isNew = false,
  isMerging = false,
  onAnimationComplete
}) => {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const textureRef = useRef(null);
  
  // Animation values
  const initialScale = isNew ? 0.01 : 1;
  const targetScale = value === 0 ? 0.001 : 1;
  const animationSpeed = 0.15;
  
  // Get the color based on the value - fallback for texture
  const getColor = () => {
    if (value === 0) return '#00000000'; // Transparent
    return defaultColors[value] || '#3c3a32'; // Default dark color for higher values
  };
  
  // TextureLoader for loading the texture
  const textureLoader = useMemo(() => {
    console.log(`[Cube ${value}] Creating TextureLoader`);
    return new THREE.TextureLoader();
  }, []);
  
  // Load the texture if available
  const texture = useMemo(() => {
    if (value === 0) return null;
    
    const texturePath = textureMap?.[value];
    if (!texturePath) {
      console.log(`[Cube ${value}] No texture available, using default color: ${getColor()}`);
      return null;
    }
    
    console.log(`[Cube ${value}] Loading texture from: ${texturePath}`);
    
    try {
      return textureLoader.load(
        texturePath,
        (loadedTexture) => {
          console.log(`[Cube ${value}] Texture loaded successfully`);
          textureRef.current = loadedTexture;
        },
        undefined,
        (error) => {
          console.error(`[Cube ${value}] Error loading texture:`, error);
          textureRef.current = null;
        }
      );
    } catch (error) {
      console.error(`[Cube ${value}] Failed to load texture:`, error);
      return null;
    }
  }, [value, textureMap, textureLoader]);
  
  // Clean up textures when component unmounts
  useEffect(() => {
    return () => {
      if (textureRef.current) {
        console.log(`[Cube ${value}] Disposing texture`);
        textureRef.current.dispose();
      }
    };
  }, [value]);
  
  // Animation loop
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    if (value === 0) {
      // Handle empty tile animation (shrink)
      meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * animationSpeed;
      meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * animationSpeed;
      meshRef.current.scale.z += (targetScale - meshRef.current.scale.z) * animationSpeed;
    } else if (isNew) {
      // Handle new tile animation (grow)
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, delta * 5);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, delta * 5);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, delta * 5);
      
      if (meshRef.current.scale.x >= 0.99) {
        onAnimationComplete?.();
      }
    } else if (isMerging) {
      // Handle merging tile animation (pulse)
      const currentScale = meshRef.current.scale.x;
      
      if (currentScale < 1.2) {
        // Growing phase
        meshRef.current.scale.x = THREE.MathUtils.lerp(currentScale, 1.2, delta * 4);
        meshRef.current.scale.y = THREE.MathUtils.lerp(currentScale, 1.2, delta * 4);
        meshRef.current.scale.z = THREE.MathUtils.lerp(currentScale, 1.2, delta * 4);
      } else {
        // Shrinking phase
        meshRef.current.scale.x = THREE.MathUtils.lerp(currentScale, 1, delta * 5);
        meshRef.current.scale.y = THREE.MathUtils.lerp(currentScale, 1, delta * 5);
        meshRef.current.scale.z = THREE.MathUtils.lerp(currentScale, 1, delta * 5);
        
        if (currentScale <= 1.02) {
          onAnimationComplete?.();
        }
      }
    }
  });
  
  // If it's an empty cell, render a simple placeholder
  if (value === 0) {
    return (
      <mesh
        ref={meshRef}
        position={position}
        scale={[initialScale, initialScale, initialScale]}
      >
        <boxGeometry args={[0.9, 0.1, 0.9]} />
        <meshStandardMaterial color="#00000020" transparent opacity={0.2} />
      </mesh>
    );
  }
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={[initialScale, initialScale, initialScale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Box args={[0.9, is2D ? 0.1 : 0.9, 0.9]} position={[0, is2D ? -0.4 : 0, 0]}>
        {texture ? (
          <meshStandardMaterial
            map={texture}
            metalness={0.1}
            roughness={0.5}
          />
        ) : (
          <meshStandardMaterial
            color={getColor()}
            metalness={0.1}
            roughness={0.5}
          />
        )}
      </Box>
      
      {/* Display the value as text */}
      {(!texture || textureRef.current === null) && (
        <Text
          position={[0, is2D ? -0.35 : 0, 0.46]}
          rotation={[0, 0, 0]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {value}
        </Text>
      )}
    </mesh>
  );
};

export default Cube; 