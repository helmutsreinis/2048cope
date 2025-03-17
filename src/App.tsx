// @ts-nocheck
import React, { Suspense, useState } from 'react';
import Game2D from './components/Game2D';
import BouncingElon from './components/BouncingElon';
import './App.css';

function App() {
  return (
    <div className="App">
      <Game2D />
      <BouncingElon />
    </div>
  );
}

export default App;
