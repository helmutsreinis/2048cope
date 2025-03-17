// This file is used to extend the JSX namespace with Three.js elements
import { ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ReactThreeFiber.Node<THREE.Group, typeof THREE.Group>;
      mesh: ReactThreeFiber.Node<THREE.Mesh, typeof THREE.Mesh>;
      boxGeometry: ReactThreeFiber.Node<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      meshStandardMaterial: ReactThreeFiber.Node<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      ambientLight: ReactThreeFiber.Node<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: ReactThreeFiber.Node<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      gridHelper: ReactThreeFiber.Node<THREE.GridHelper, typeof THREE.GridHelper>;
      orbitControls: any;
      perspectiveCamera: any;
    }
  }
} 