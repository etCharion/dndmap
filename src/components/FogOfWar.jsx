import React from 'react';
import { Eye } from 'lucide-react';

const FogOfWar = ({ areas = [], onReveal, isAdmin }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <svg className="w-full h-full">
        {areas.map((area) => {
          if (area.isRevealed) return null;

          if (area.type === 'rect') {
            const [x, y, w, h] = area.points;
            return (
              <rect
                key={area.id}
                x={`${x}%`}
                y={`${y}%`}
                width={`${w}%`}
                height={`${h}%`}
                fill="black"
                fillOpacity="1"
                className="pointer-events-auto"
              />
            );
          }

          if (area.type === 'poly') {
            const pointsStr = area.points.map(p => `${p.x}%,${p.y}%`).join(' ');
            return (
              <polygon
                key={area.id}
                points={pointsStr}
                fill="black"
                fillOpacity="1"
                className="pointer-events-auto"
              />
            );
          }

          return null;
        })}
      </svg>

      {/* Reveal buttons */}
      {areas.map((area) => {
        if (area.isRevealed) return null;

        // Calculate center for the button
        let cx = 0, cy = 0;
        if (area.type === 'rect') {
          cx = area.points[0] + area.points[2] / 2;
          cy = area.points[1] + area.points[3] / 2;
        } else if (area.type === 'poly') {
          cx = area.points.reduce((sum, p) => sum + p.x, 0) / area.points.length;
          cy = area.points.reduce((sum, p) => sum + p.y, 0) / area.points.length;
        }

        return (
          <button
            key={`reveal-${area.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onReveal(area.id);
            }}
            className="absolute p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm pointer-events-auto transition-all hover:scale-110 z-50"
            style={{
              left: `${cx}%`,
              top: `${cy}%`,
              transform: 'translate(-50%, -50%)',
            }}
            title="Odkrýt oblast"
          >
            <Eye size={20} />
          </button>
        );
      })}
    </div>
  );
};

export default FogOfWar;
