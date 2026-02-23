import React, { useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Token from './Token';
import FogOfWar from './FogOfWar';

const MapView = ({
  mapUrl,
  tokens = [],
  fogAreas = [],
  onTokenMove,
  onAreaReveal,
  isAdmin = false,
  onMapClick
}) => {
  const mapRef = useRef(null);

  const handleMapClick = (e) => {
    if (!isAdmin || !onMapClick) return;

    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    onMapClick({ x, y });
  };

  if (!mapUrl) {
    return (
      <div className="flex items-center justify-center h-full text-zinc-500">
        Není vybrána žádná mapa
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={10}
        centerOnInit={true}
        limitToBounds={false}
        disabled={false} // We can toggle this if needed
      >
        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!min-w-full !min-h-full flex items-center justify-center">
          <div className="relative inline-block" ref={mapRef} onClick={handleMapClick}>
            <img
              src={mapUrl}
              alt="DnD Map"
              className="max-w-none block pointer-events-none select-none"
              style={{ maxHeight: 'none' }}
              onLoad={(e) => {
                // We might need to store dimensions for some calculations
              }}
            />

            {/* Fog of War Layer */}
            <FogOfWar
              areas={fogAreas}
              onReveal={onAreaReveal}
              isAdmin={isAdmin}
            />

            {/* Tokens Layer */}
            {tokens.map((token) => (
              <Token
                key={token.id}
                token={token}
                onMove={onTokenMove}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default MapView;
