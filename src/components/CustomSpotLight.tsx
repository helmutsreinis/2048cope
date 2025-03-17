// @ts-nocheck
// This is a modified version of the SpotLight component from @react-three/drei
// with LinearEncoding removed to work with Three.js v0.150.0+

import * as React from 'react';
import { useRef, useMemo, useLayoutEffect } from 'react';
import { 
  Vector3, 
  CylinderGeometry, 
  Matrix4, 
  WebGLRenderTarget, 
  RGBAFormat, 
  ShaderMaterial, 
  DoubleSide, 
  RepeatWrapping,
  SpotLight as ThreeSpotLight,
  SpotLightHelper,
  Group
} from 'three';
import { useThree, useFrame } from '@react-three/fiber';

export function CustomSpotLight({
  children,
  color = 'white',
  position = [0, 0, 0],
  intensity = 1,
  angle = 0.15,
  penumbra = 0,
  distance = 5,
  decay = 2,
  castShadow = true,
  showHelper = false,
  ...props
}) {
  const groupRef = useRef();
  const spotLightRef = useRef();
  const helperRef = useRef();

  // Update the spotlight and helper on changes
  useLayoutEffect(() => {
    if (spotLightRef.current) {
      spotLightRef.current.position.set(...position);
      spotLightRef.current.color.set(color);
      spotLightRef.current.intensity = intensity;
      spotLightRef.current.angle = angle;
      spotLightRef.current.penumbra = penumbra;
      spotLightRef.current.distance = distance;
      spotLightRef.current.decay = decay;
      spotLightRef.current.castShadow = castShadow;
      
      if (castShadow) {
        spotLightRef.current.shadow.mapSize.width = 1024;
        spotLightRef.current.shadow.mapSize.height = 1024;
        spotLightRef.current.shadow.bias = -0.0001;
      }
    }
    
    if (helperRef.current && showHelper) {
      helperRef.current.update();
    }
  }, [position, color, intensity, angle, penumbra, distance, decay, castShadow, showHelper]);

  // Update the helper on each frame
  useFrame(() => {
    if (helperRef.current && showHelper) {
      helperRef.current.update();
    }
  });

  return (
    <group ref={groupRef} {...props}>
      <spotLight 
        ref={spotLightRef}
        position={position}
        color={color}
        intensity={intensity}
        angle={angle}
        penumbra={penumbra}
        distance={distance}
        decay={decay}
        castShadow={castShadow}
      />
      {showHelper && (
        <primitive 
          ref={helperRef} 
          object={new SpotLightHelper(spotLightRef.current)} 
        />
      )}
      {children}
    </group>
  );
} 