// @ts-nocheck
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { BoardProps } from '../types';
import { Board } from './Board';

export const GameScene: React.FC<BoardProps> = ({ gameState, textureMap }) => {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas shadows>
        {/* Camera */}
        <PerspectiveCamera makeDefault position={[0, 5, 5]} />
        <OrbitControls enableZoom={true} minDistance={5} maxDistance={10} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        
        {/* Game Board */}
        <Board gameState={gameState} textureMap={textureMap} />
      </Canvas>
    </div>
  );
}; 