// @ts-nocheck
import React from 'react'
import ReactDOM from 'react-dom/client'
// Import patch before any Three.js related imports
import './drei-patch'
import * as THREE from 'three'
import App from './App.tsx'
// import MinimalApp from './MinimalApp.tsx'
// import UltraMinimalApp from './UltraMinimalApp.tsx'
import './index.css'

// Make sure the patch has been applied
console.log("main.tsx: THREE.ShaderChunk available:", !!THREE.ShaderChunk);
console.log("main.tsx: encodings_fragment available:", !!THREE.ShaderChunk.encodings_fragment);

// Define a proxy for backward compatibility instead of modifying THREE directly
const ThreeWithCompat = {
  ...THREE,
  // Use getters to provide access to compatibility constants
  get LinearEncoding() { return THREE.LinearEncoding; },
  get sRGBEncoding() { return THREE.sRGBEncoding; },
  get GammaEncoding() { return THREE.GammaEncoding; }
};

// Make our enhanced version globally available (without modifying THREE)
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.ThreeWithCompat = ThreeWithCompat;
  console.log("main.tsx: ThreeWithCompat object attached to window", ThreeWithCompat);
}

// Note: We're using @ts-nocheck in our components, so we don't need to extend JSX elements
// The Three.js objects will be available through JSX intrinsics

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
