interface BackgroundLevel {
  min: number;
  max: number;
  color: string;
  name: string;
}

// Define background levels based on score
const backgroundLevels: BackgroundLevel[] = [
  {
    min: 0,
    max: 500,
    color: 'linear-gradient(to right, #141e30, #243b55)',
    name: 'Kitchen Prep'
  },
  {
    min: 501,
    max: 1000,
    color: 'linear-gradient(to right, #3a6186, #89253e)',
    name: 'Line Cook'
  },
  {
    min: 1001,
    max: 2000,
    color: 'linear-gradient(to right, #ef3b36, #ffffff)',
    name: 'Sous Chef'
  },
  {
    min: 2001,
    max: 5000,
    color: 'linear-gradient(to right, #ff8008, #ffc837)',
    name: 'Head Chef'
  },
  {
    min: 5001,
    max: Infinity,
    color: 'linear-gradient(to right, #f85032, #e73827)',
    name: 'Executive Chef'
  }
];

// Function to get the background based on score
export const getBackgroundForScore = (score: number): BackgroundLevel => {
  const level = backgroundLevels.find(bg => score >= bg.min && score <= bg.max);
  return level || backgroundLevels[0]; // Default to first level if no match
};

// Empty function since we're not using images anymore
export const preloadBackgroundImages = (): void => {
  // Not needed anymore
};

// Not needed anymore, just for backwards compatibility
export const generateFallbackBackground = (level: number): string => {
  const index = Math.min(level, backgroundLevels.length - 1);
  return backgroundLevels[index].color;
}; 