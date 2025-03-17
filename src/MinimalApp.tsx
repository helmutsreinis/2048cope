// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { ThreeCompat } from './drei-patch';
import './App.css';

// Error boundary to catch React Three Fiber errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Three.js Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: 'red', padding: '20px', border: '1px solid red' }}>
          <h2>Something went wrong with the 3D rendering</h2>
          <p>{this.state.error?.message || 'Unknown error'}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple compatibility wrapper component 
function ThreeCompatSetup() {
  const { gl, scene } = useThree();
  
  useEffect(() => {
    console.log("ThreeCompatSetup mounted");
    // Ensure Three.js uses our compatibility constants
    console.log("ThreeCompat:", ThreeCompat);
    console.log("Renderer encoding set to:", ThreeCompat.LinearEncoding);
    // Set output encoding using our constant instead of accessing THREE directly
    gl.outputEncoding = ThreeCompat.LinearEncoding;
  }, [gl, scene]);
  
  return null;
}

// Simple cube component for testing
function Cube() {
  const meshRef = useRef();
  
  useEffect(() => {
    console.log("Cube component mounted");
  }, []);

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

function MinimalApp() {  
  return (
    <div className="app-container">
      <h1>Minimal Three.js Test</h1>
      <div style={{ width: '100%', height: '500px', border: '2px solid red' }}>
        <ErrorBoundary>
          <Canvas
            camera={{ position: [0, 2, 5], fov: 75 }}
            style={{ background: '#f0f0f0' }}
          >
            <ThreeCompatSetup />
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Cube />
            <OrbitControls />
          </Canvas>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default MinimalApp; 