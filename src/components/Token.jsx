import React, { useState, useEffect, useRef } from 'react';

const Token = ({ token, onMove, isAdmin }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const tokenRef = useRef(null);

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff', '#000000'];

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    e.stopPropagation(); // Prevent map pan
    setIsDragging(true);

    // We store the offset so the token doesn't "jump" to the center of the mouse
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleClick = (e) => {
    if (!isAdmin) return;
    // Change color on click if not dragged much
    // For simplicity, we can use a double click or just a long press?
    // Let's use Shift + Click to change color or cycle through colors
    if (e.shiftKey) {
      e.stopPropagation();
      const currentIndex = COLORS.indexOf(token.color || '#3b82f6');
      const nextColor = COLORS[(currentIndex + 1) % COLORS.length];
      onMove(token.id, token.x, token.y, nextColor);
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const mapElement = tokenRef.current.parentElement;
      const mapRect = mapElement.getBoundingClientRect();

      // Calculate new position in percentages relative to the map
      let x = ((e.clientX - dragOffset.x - mapRect.left) / mapRect.width) * 100;
      let y = ((e.clientY - dragOffset.y - mapRect.top) / mapRect.height) * 100;

      onMove(token.id, x, y);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, onMove, token.id]);

  return (
    <div
      ref={tokenRef}
      className={`absolute cursor-move select-none transition-transform ${isDragging ? 'scale-110 z-50' : 'z-40'}`}
      style={{
        left: `${token.x}%`,
        top: `${token.y}%`,
        transform: 'translate(-50%, -50%)', // Center on coordinates
        width: `${token.size || 50}px`,
        height: `${token.size || 50}px`,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div
        className="w-full h-full rounded-full border-[3px] shadow-lg overflow-hidden bg-zinc-800"
        style={{ borderColor: token.color || '#fff' }}
      >
        {token.imageUrl ? (
          <img src={token.imageUrl} alt={token.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold truncate px-1">
            {token.name?.[0]?.toUpperCase() || '?'}
          </div>
        )}
      </div>
      {token.name && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-black/60 text-white text-[10px] px-1 rounded whitespace-nowrap pointer-events-none">
          {token.name}
        </div>
      )}
    </div>
  );
};

export default Token;
