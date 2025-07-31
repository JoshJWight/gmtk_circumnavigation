import React, {createContext, useContext, useEffect, useState} from 'react';
import './GlobeMap.css';

export const GlobeMap: React.FC<React.PropsWithChildren> = ({  }) => {
    
    return (
      <div className="globe-map">
        <p>Globe Map</p>
        <div className="map-container">
          {/* Placeholder for globe map */}
          <div className="globe-placeholder">Globe Map Placeholder</div>
        </div>
      </div>
    );
  };
  
  export default GlobeMap;