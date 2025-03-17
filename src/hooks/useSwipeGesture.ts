import { useEffect } from 'react';
import { Direction } from '../types';

interface SwipeOptions {
  onSwipe: (direction: Direction) => void;
  threshold?: number; // Minimum distance for a swipe
  element?: HTMLElement | null; // Element to attach listeners to (defaults to document)
}

export const useSwipeGesture = ({ onSwipe, threshold = 30, element = null }: SwipeOptions) => {
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    const MAX_SWIPE_TIME = 500; // Increased max time for a swipe
    
    const targetElement = element || document;
    
    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (!touchEvent.touches[0]) return;
      
      startX = touchEvent.touches[0].clientX;
      startY = touchEvent.touches[0].clientY;
      startTime = Date.now();
      
      // Prevent default to avoid any scrolling during game play
      if (touchEvent.target instanceof HTMLElement && 
          (touchEvent.target.closest('.game-container') || touchEvent.target.closest('.controls'))) {
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (!touchEvent.changedTouches[0]) return;
      
      const endX = touchEvent.changedTouches[0].clientX;
      const endY = touchEvent.changedTouches[0].clientY;
      const endTime = Date.now();
      
      // Calculate distance and time
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const deltaTime = endTime - startTime;
      
      // Log swipe details for debugging
      console.log(`Swipe: deltaX=${deltaX}, deltaY=${deltaY}, time=${deltaTime}ms`);
      
      // Check if the swipe was fast enough
      if (deltaTime > MAX_SWIPE_TIME) {
        console.log('Swipe too slow');
        return;
      }
      
      // Determine direction based on which axis had the larger movement
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) >= threshold) {
          if (deltaX > 0) {
            console.log('Swipe right detected');
            onSwipe('right');
          } else {
            console.log('Swipe left detected');
            onSwipe('left');
          }
        } else {
          console.log('Horizontal swipe below threshold');
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) >= threshold) {
          if (deltaY > 0) {
            console.log('Swipe down detected');
            onSwipe('down');
          } else {
            console.log('Swipe up detected');
            onSwipe('up');
          }
        } else {
          console.log('Vertical swipe below threshold');
        }
      }
      
      // Prevent default behavior after swipe detection
      if (touchEvent.target instanceof HTMLElement && 
          (touchEvent.target.closest('.game-container') || touchEvent.target.closest('.controls'))) {
        e.preventDefault();
      }
    };
    
    // Prevent scrolling when swiping inside the game area
    const handleTouchMove = (e: Event) => {
      const touchEvent = e as TouchEvent;
      
      // Prevent default for touch events inside game container to stop scrolling
      if (touchEvent.target instanceof HTMLElement && 
          (touchEvent.target.closest('.game-container') || touchEvent.target.closest('.controls'))) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    
    // Add event listeners
    targetElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    targetElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    targetElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Also handle keyboard events here for better integration
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          onSwipe('up');
          e.preventDefault();
          break;
        case 'ArrowDown':
          onSwipe('down');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          onSwipe('left');
          e.preventDefault();
          break;
        case 'ArrowRight':
          onSwipe('right');
          e.preventDefault();
          break;
      }
    };
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      targetElement.removeEventListener('touchstart', handleTouchStart);
      targetElement.removeEventListener('touchend', handleTouchEnd);
      targetElement.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onSwipe, threshold, element]);
}; 