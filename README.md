# 4096 Cube Game

A 3D version of the popular 2048 game, built with React, TypeScript, and Three.js using React Three Fiber.

## Features

- Classic 2048-style gameplay with a goal of reaching the 4096 tile
- 3D tiles with customizable textures
- Responsive design for desktop and mobile
- Score tracking
- Game over and win conditions

## How to Play

1. Use arrow keys, WASD, or the on-screen buttons to move all tiles in one direction
2. When two tiles with the same number touch, they merge into one with the combined value
3. A new tile appears after each move
4. The game ends when you reach 4096 or there are no more valid moves

## Embedded Textures

The game now uses embedded textures for the tiles instead of allowing user uploads. These textures are located in the `public/textures` directory and follow the naming pattern `tile-[value].png`.

### Generating Textures

If you want to generate your own textures, you can use the included utility script:

```bash
# First install the required dependency
npm install canvas

# Then run the script
node src/utils/generateTextures.js
```

## Development

This project was built with:

- React 18
- TypeScript
- Three.js
- React Three Fiber
- Vite

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## License

MIT

## Acknowledgments

- Inspired by the original 2048 game by Gabriele Cirulli
- Three.js for the 3D rendering capabilities
