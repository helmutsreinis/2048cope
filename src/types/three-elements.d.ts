import { Object3DNode, BufferGeometryNode, MaterialNode, LightNode } from '@react-three/fiber';
import { Group, Mesh, BoxGeometry, MeshStandardMaterial, AmbientLight, DirectionalLight, GridHelper } from 'three';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<Group, typeof Group>;
      mesh: Object3DNode<Mesh, typeof Mesh>;
      boxGeometry: BufferGeometryNode<BoxGeometry, typeof BoxGeometry>;
      meshStandardMaterial: MaterialNode<MeshStandardMaterial, typeof MeshStandardMaterial>;
      ambientLight: LightNode<AmbientLight, typeof AmbientLight>;
      directionalLight: LightNode<DirectionalLight, typeof DirectionalLight>;
      gridHelper: Object3DNode<GridHelper, typeof GridHelper>;
    }
  }
} 