// This file is used to extend the JSX namespace with Three.js elements

declare namespace JSX {
  interface IntrinsicElements {
    group: any;
    mesh: any;
    boxGeometry: any;
    meshStandardMaterial: any;
    ambientLight: any;
    directionalLight: any;
    gridHelper: any;
    orbitControls: any;
    perspectiveCamera: any;
  }
} 