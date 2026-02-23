import React, { useState, useEffect } from 'react';
import { useAppState } from './hooks/useAppState';
import MapView from './components/MapView';
import AdminPanel from './components/AdminPanel';
import GameOverlay from './components/GameOverlay';
import { getRepoInfo } from './services/github';

function App() {
  const { state, setConfig, setActiveMap, updateMapState, updateState } = useAppState();
  const [isAdmin, setIsAdmin] = useState(() => {
    return window.location.hash === '#admin';
  });

  // Listen for hash change to toggle admin mode
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);

    // Auto-detect repo info on first load if not set
    if (!state.config.ghOwner || !state.config.ghRepo) {
      const { owner, repo } = getRepoInfo();
      if (owner && repo) {
        setConfig(owner, repo);
      }
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [state.config.ghOwner, state.config.ghRepo, setConfig]);

  const activeMapState = state.activeMapId ? (state.mapStates[state.activeMapId] || { tokens: [], fogAreas: [] }) : { tokens: [], fogAreas: [] };

  const handleTokenMove = (tokenId, x, y, color) => {
    updateMapState(state.activeMapId, (prev) => ({
      ...prev,
      tokens: prev.tokens.map(t => t.id === tokenId ? { ...t, x, y, color: color || t.color } : t)
    }));
  };

  const handleAreaReveal = (areaId) => {
    updateMapState(state.activeMapId, (prev) => ({
      ...prev,
      fogAreas: prev.fogAreas.map(a => a.id === areaId ? { ...a, isRevealed: true } : a)
    }));
  };

  const handleAddToken = (charFile) => {
    const newToken = {
      id: Date.now().toString(),
      characterId: charFile.path,
      imageUrl: charFile.url,
      name: charFile.name.split('.')[0],
      x: 50,
      y: 50,
      size: 60,
      color: '#3b82f6' // Default blue
    };
    updateMapState(state.activeMapId, (prev) => ({
      ...prev,
      tokens: [...prev.tokens, newToken]
    }));
  };

  const handleAddFogArea = (type) => {
    const newArea = {
      id: Date.now().toString(),
      type: type,
      points: type === 'rect' ? [40, 40, 20, 20] : [{x:40, y:40}, {x:60, y:40}, {x:50, y:60}],
      isRevealed: false
    };
    updateMapState(state.activeMapId, (prev) => ({
      ...prev,
      fogAreas: [...prev.fogAreas, newArea]
    }));
  };

  const handleResetMap = (mapId) => {
    if (window.confirm('Opravdu chcete resetovat tuto mapu (odstranit postavy a vrátit mlhu)?')) {
      updateMapState(mapId, { tokens: [], fogAreas: [] });
    }
  };

  // Find the URL of the active map
  // We should probably store the URL in the state too, or fetch it again
  // For now, let's assume we can get it from the mapId if it's the path
  // Better: store map metadata in state
  const [activeMapUrl, setActiveMapUrl] = useState(null);

  // This is a bit hacky, we should store map metadata properly
  useEffect(() => {
    if (state.activeMapId) {
      // In a real app we'd have the URL from the fetchFiles call
      // For now, let's just use it if we have it or fetch it
      // Since fetchFiles is async, we might need a better way.
      // For this demo, I'll store the URL in activeMapId for simplicity or pass it from AdminPanel
    }
  }, [state.activeMapId]);

  const handleMapSelect = (map) => {
    setActiveMap(map.path);
    setActiveMapUrl(map.url);
    // Persist URL so it works on reload/sync
    localStorage.setItem(`map_url_${map.path}`, map.url);
  };

  useEffect(() => {
    if (state.activeMapId) {
      const savedUrl = localStorage.getItem(`map_url_${state.activeMapId}`);
      if (savedUrl) setActiveMapUrl(savedUrl);
    }
  }, [state.activeMapId]);

  return (
    <div className="h-screen w-screen bg-black text-white overflow-hidden flex">
      {isAdmin && (
        <AdminPanel
          state={state}
          onConfigChange={setConfig}
          onMapSelect={handleMapSelect}
          onAddToken={handleAddToken}
          onAddFogArea={handleAddFogArea}
          onResetMap={handleResetMap}
        />
      )}

      <main className="flex-1 relative">
        <MapView
          mapUrl={activeMapUrl}
          tokens={activeMapState.tokens}
          fogAreas={activeMapState.fogAreas}
          onTokenMove={handleTokenMove}
          onAreaReveal={handleAreaReveal}
          isAdmin={isAdmin}
        />

        {!isAdmin && (
          <GameOverlay
            state={state}
            onMapSelect={handleMapSelect}
            onAddToken={handleAddToken}
          />
        )}

        {/* Admin/Game Toggle Indicator */}
        <div className="absolute top-4 right-4 z-[110] flex gap-2">
          {!isAdmin ? (
            <a href="#admin" className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 rounded text-xs text-zinc-400 transition-colors">
              DM Mode
            </a>
          ) : (
            <a href="#" className="px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white transition-colors shadow-lg">
              Admin Active
            </a>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
