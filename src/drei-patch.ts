// @ts-nocheck
// Comprehensive patch for Three.js compatibility issues
// This file defines replacements for missing constants and shader chunks

import * as THREE from 'three';

// Define the constants
export const LINEAR_ENCODING = 3000;
export const SRGB_ENCODING = 3001;
export const GAMMA_ENCODING = 3007;

// Create a compatibility layer 
export const ThreeCompat = {
  LinearEncoding: LINEAR_ENCODING,
  sRGBEncoding: SRGB_ENCODING,
  GammaEncoding: GAMMA_ENCODING
};

// Patch the shader chunks to add missing encodings_fragment
// This is necessary for newer versions of Three.js
if (typeof THREE !== 'undefined' && THREE.ShaderChunk) {
  // Add the missing shader chunk if it doesn't exist
  if (!THREE.ShaderChunk.encodings_fragment) {
    THREE.ShaderChunk.encodings_fragment = `
    // Add basic encoding functions
    vec4 linearToOutputTexel( vec4 value ) {
      return value;
    }
    `;
    
    console.log('Added missing encodings_fragment shader chunk');
  }

  // Ensure other critical shader chunks exist
  const criticalChunks = [
    'tonemapping_fragment',
    'encodings_pars_fragment'
  ];
  
  criticalChunks.forEach(chunkName => {
    if (!THREE.ShaderChunk[chunkName]) {
      THREE.ShaderChunk[chunkName] = '// Empty compatibility stub';
      console.log(`Added empty compatibility stub for ${chunkName}`);
    }
  });
}

// Log that the patch has been applied
console.log('Three.js compatibility patch applied'); 