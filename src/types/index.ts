export interface GameState {
  board: number[][];
  score: number;
  gameOver: boolean;
  won: boolean;
}

export interface CubeProps {
  position: [number, number, number];
  value: number;
  textureMap?: Record<number, string>;
  is2D?: boolean;
}

export interface BoardProps {
  gameState: GameState;
  textureMap: Record<number, string>;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface TextureMapItem {
  value: number;
  imageUrl: string;
} 