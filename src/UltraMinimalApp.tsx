// @ts-nocheck
import React, { useEffect } from 'react';

function UltraMinimalApp() {
  useEffect(() => {
    console.log("UltraMinimalApp rendered");
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        console.error("WebGL not supported");
      } else {
        console.log("WebGL is supported");
        
        // Log WebGL info
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          console.log('WebGL vendor:', gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL));
          console.log('WebGL renderer:', gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
        }
      }
    } catch (e) {
      console.error("WebGL check failed", e);
    }
  }, []);

  return (
    <div className="app-container" style={{ padding: '20px' }}>
      <h1>Ultra Minimal Test (No Three.js)</h1>
      <div style={{ 
        width: '100%', 
        height: '300px', 
        border: '2px solid blue',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#e0e0e0'
      }}>
        <p style={{ fontSize: '24px' }}>
          If you can see this text, React is working correctly
        </p>
      </div>
    </div>
  );
}

export default UltraMinimalApp; 