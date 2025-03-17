// @ts-nocheck
import React from 'react';
import { Canvas } from '@react-three/fiber';

export const TestScene: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '500px', border: '2px solid red' }}>
      <Canvas>
        <ambientLight />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
    </div>
  );
}; 