// @ts-nocheck
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Box } from '@react-three/drei';
import { BoardProps } from '../types';
import { Cube } from './Cube';

export const GameBoard3D: React.FC<BoardProps> = ({ gameState, textureMap }) => {
  const { board } = gameState;
  
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Canvas shadows dpr={[1, 2]} gl={{ preserveDrawingBuffer: true }}>
        {/* Camera positioned for clear view of the board */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 8, 1]} // Slightly angled for better number visibility
          fov={40} 
          near={0.1} 
          far={100} 
        />
        <OrbitControls 
          enablePan={false} 
          enableZoom={true}
          enableRotate={false} // Disable rotation for 2D-like view
          minDistance={7}
          maxDistance={15}
          target={[0, 0, 0]}
        />
        
        {/* Bright lighting for better visibility */}
        <ambientLight intensity={1.0} />
        <directionalLight
          position={[0, 10, 5]}
          intensity={1.0}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        
        {/* Game Board */}
        <group>
          {/* Grid lines */}
          <Grid 
            args={[4, 4]} 
            position={[0, -0.25, 0]} 
            cellSize={1}
            cellThickness={1.5}
            cellColor="#8f7a66"
            sectionSize={2}
            sectionThickness={1.5}
            sectionColor="#8f7a66"
            fadeDistance={50}
            fadeStrength={1}
          />
          
          {/* Board base */}
          <Box position={[0, -0.3, 0]} args={[4.2, 0.1, 4.2]} receiveShadow>
            <meshStandardMaterial color="#bbada0" />
          </Box>
          
          {/* Cubes */}
          {board.map((row, rowIndex) =>
            row.map((value, colIndex) => (
              <Cube
                key={`${rowIndex}-${colIndex}`}
                position={[
                  colIndex - 1.5, // Center the board
                  0,
                  rowIndex - 1.5 // Center the board
                ]}
                value={value}
                textureMap={textureMap}
                is2D={true} // Flag for 2D mode
              />
            ))
          )}
        </group>
      </Canvas>
    </div>
  );
}; 