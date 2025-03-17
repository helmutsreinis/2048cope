import React, { useState } from 'react';
import { TextureMapItem } from '../types';
import '../styles/TextureManager.css';

interface TextureManagerProps {
  onTextureUpdate: (item: TextureMapItem) => void;
  onTextureRemove: (value: number) => void;
  onTextureClear: () => void;
  textureMap: Record<number, string>;
}

export const TextureManager: React.FC<TextureManagerProps> = ({
  onTextureUpdate,
  onTextureRemove,
  onTextureClear,
  textureMap
}) => {
  const [value, setValue] = useState<number>(2);
  const [imageUrl, setImageUrl] = useState<string>('');
  
  // Possible tile values in the game
  const possibleValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value && imageUrl) {
      onTextureUpdate({ value, imageUrl });
      setImageUrl('');
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="texture-manager">
      <h3>Customize Tile Textures</h3>
      
      <form onSubmit={handleSubmit} className="texture-form">
        <div className="form-group">
          <label htmlFor="value-select">Tile Value:</label>
          <select
            id="value-select"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
          >
            {possibleValues.map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="image-upload">Upload Image:</label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        
        {imageUrl && (
          <div className="image-preview">
            <img src={imageUrl} alt="Preview" style={{ width: '100px', height: '100px' }} />
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" disabled={!imageUrl}>
            Apply Texture
          </button>
        </div>
      </form>
      
      <div className="current-textures">
        <h4>Current Custom Textures</h4>
        {Object.keys(textureMap).length === 0 ? (
          <p>No custom textures applied.</p>
        ) : (
          <div className="texture-list">
            {Object.entries(textureMap).map(([valueStr, url]) => (
              <div key={valueStr} className="texture-item">
                <div className="texture-value">{valueStr}</div>
                <img src={url} alt={`Texture for ${valueStr}`} className="texture-thumbnail" />
                <button
                  onClick={() => onTextureRemove(Number(valueStr))}
                  className="remove-texture"
                >
                  Remove
                </button>
              </div>
            ))}
            <button onClick={onTextureClear} className="clear-textures">
              Clear All Textures
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 