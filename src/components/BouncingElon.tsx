// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react';
import '../styles/BouncingElon.css';

const BouncingElon = () => {
  const elonRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [velocity, setVelocity] = useState({ x: 3, y: 2 });
  const [rotation, setRotation] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 80, height: 80 });
  
  // Get initial dimensions once mounted
  useEffect(() => {
    if (elonRef.current) {
      const rect = elonRef.current.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height
      });
    }
    
    // Update dimensions on window resize
    const handleResize = () => {
      if (elonRef.current) {
        const rect = elonRef.current.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    // Function to animate the movement
    const animate = () => {
      if (!elonRef.current) return;
      
      setPosition(prev => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const { width, height } = dimensions;
        
        // Calculate new position
        let newX = prev.x + velocity.x;
        let newY = prev.y + velocity.y;
        let newVelX = velocity.x;
        let newVelY = velocity.y;
        
        // Check right and left boundaries
        if (newX + width >= windowWidth) {
          newX = windowWidth - width; // Place exactly at the edge
          newVelX = -Math.abs(newVelX); // Ensure velocity is negative (moving left)
        } else if (newX <= 0) {
          newX = 0; // Place exactly at the edge
          newVelX = Math.abs(newVelX); // Ensure velocity is positive (moving right)
        }
        
        // Check bottom and top boundaries
        if (newY + height >= windowHeight) {
          newY = windowHeight - height; // Place exactly at the edge
          newVelY = -Math.abs(newVelY); // Ensure velocity is negative (moving up)
        } else if (newY <= 0) {
          newY = 0; // Place exactly at the edge
          newVelY = Math.abs(newVelY); // Ensure velocity is positive (moving down)
        }
        
        // Update velocity if it changed
        if (newVelX !== velocity.x || newVelY !== velocity.y) {
          setVelocity({ x: newVelX, y: newVelY });
        }
        
        return { x: newX, y: newY };
      });
      
      // Rotate based on horizontal movement
      setRotation(prev => {
        // Calculate rotation based on horizontal velocity to create a "rolling" effect
        return prev + velocity.x * 1;
      });
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    requestRef.current = requestAnimationFrame(animate);
    
    // Clean up animation frame on unmount
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [velocity, dimensions]);
  
  const style = {
    transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
    position: 'fixed',
    zIndex: 1000,
  };
  
  return (
    <div 
      ref={elonRef} 
      className="bouncing-elon" 
      style={style}
    >
      <img 
        src="/assets/misc/elonnn.png" 
        alt="Bouncing Elon" 
        width="80" 
        height="80"
      />
    </div>
  );
};

export default BouncingElon; 