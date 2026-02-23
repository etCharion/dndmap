import React, { useState, useEffect } from 'react';
import { fetchFiles } from '../services/github';
import { Users, Map as MapIcon, ChevronRight, ChevronLeft } from 'lucide-react';

const GameOverlay = ({ state, onMapSelect, onAddToken }) => {
  const [isMapsOpen, setIsMapsOpen] = useState(false);
  const [isCharsOpen, setIsCharsOpen] = useState(false);
  const [maps, setMaps] = useState([]);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const load = async () => {
      const m = await fetchFiles('maps');
      const c = await fetchFiles('characters');
      setMaps(m);
      setCharacters(c);
    };
    load();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none z-50">
      {/* Map Switcher */}
      <div className="flex flex-col items-start gap-2 pointer-events-auto">
        {isMapsOpen && (
          <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-lg p-2 flex gap-2 overflow-x-auto max-w-[80vw] shadow-2xl">
            {maps.map(map => (
              <button
                key={map.path}
                onClick={() => onMapSelect(map)}
                className={`flex-shrink-0 w-24 p-1 rounded border transition-all ${state.activeMapId === map.path ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}
              >
                <div className="aspect-video bg-black rounded overflow-hidden mb-1">
                  <img src={map.url} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="text-[10px] truncate">{map.name}</div>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => {setIsMapsOpen(!isMapsOpen); setIsCharsOpen(false);}}
          className="bg-zinc-900/90 backdrop-blur p-3 rounded-full border border-zinc-800 text-white shadow-lg hover:bg-zinc-800 transition-all"
        >
          <MapIcon size={24} />
        </button>
      </div>

      {/* Character Adder */}
      <div className="flex flex-col items-end gap-2 pointer-events-auto">
        {isCharsOpen && (
          <div className="bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-lg p-2 flex gap-2 overflow-x-auto max-w-[80vw] shadow-2xl">
            {characters.map(char => (
              <button
                key={char.path}
                onClick={() => onAddToken(char)}
                className="flex-shrink-0 w-16 p-1 border border-zinc-700 hover:border-blue-500 rounded transition-all group"
              >
                <div className="aspect-square bg-black rounded-full overflow-hidden border-2 border-transparent group-hover:border-blue-500">
                  <img src={char.url} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="text-[10px] truncate mt-1 text-center">{char.name.split('.')[0]}</div>
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => {setIsCharsOpen(!isCharsOpen); setIsMapsOpen(false);}}
          className="bg-zinc-900/90 backdrop-blur p-3 rounded-full border border-zinc-800 text-white shadow-lg hover:bg-zinc-800 transition-all"
        >
          <Users size={24} />
        </button>
      </div>
    </div>
  );
};

export default GameOverlay;
