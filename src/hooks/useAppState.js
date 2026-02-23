import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'dnd_map_app_state';

const DEFAULT_STATE = {
  activeMapId: null,
  mapStates: {},
  config: {
    ghOwner: '',
    ghRepo: ''
  }
};

export const useAppState = () => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  const updateState = useCallback((updater) => {
    setState((prev) => {
      const newState = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // Listen for changes from other tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const setConfig = (ghOwner, ghRepo) => {
    updateState(prev => ({
      ...prev,
      config: { ghOwner, ghRepo }
    }));
    if (ghOwner) localStorage.setItem('gh_owner', ghOwner);
    if (ghRepo) localStorage.setItem('gh_repo', ghRepo);
  };

  const setActiveMap = (mapId) => {
    updateState(prev => ({ ...prev, activeMapId: mapId }));
  };

  const updateMapState = (mapId, mapStateUpdater) => {
    updateState(prev => {
      const currentMapState = prev.mapStates[mapId] || { tokens: [], fogAreas: [] };
      const newMapState = typeof mapStateUpdater === 'function'
        ? mapStateUpdater(currentMapState)
        : { ...currentMapState, ...mapStateUpdater };

      return {
        ...prev,
        mapStates: {
          ...prev.mapStates,
          [mapId]: newMapState
        }
      };
    });
  };

  return {
    state,
    updateState,
    setConfig,
    setActiveMap,
    updateMapState
  };
};
