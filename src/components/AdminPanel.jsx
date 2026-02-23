import React, { useState, useEffect } from 'react';
import { fetchFiles } from '../services/github';
import { Settings, Users, Layers, Map as MapIcon, X, Plus, Trash2, RefreshCw } from 'lucide-react';

const AdminPanel = ({
  state,
  onConfigChange,
  onMapSelect,
  onAddToken,
  onAddFogArea,
  onResetMap
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('maps');
  const [maps, setMaps] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [ghOwner, setGhOwner] = useState(state.config.ghOwner || '');
  const [ghRepo, setGhRepo] = useState(state.config.ghRepo || '');

  const loadFiles = async () => {
    setIsLoading(true);
    const m = await fetchFiles('maps');
    const c = await fetchFiles('characters');
    setMaps(m);
    setCharacters(c);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadFiles();
    }
  }, [isOpen]);

  const handleSaveConfig = () => {
    onConfigChange(ghOwner, ghRepo);
    loadFiles();
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-zinc-900 border-r border-zinc-800 transition-all z-[100] ${isOpen ? 'w-80' : 'w-12'}`}>
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 hover:bg-zinc-800 text-zinc-400 self-end"
        >
          {isOpen ? <X size={20} /> : <Settings size={20} />}
        </button>

        {isOpen && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex border-b border-zinc-800">
              <button
                onClick={() => setActiveTab('maps')}
                className={`flex-1 p-3 text-sm font-medium ${activeTab === 'maps' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}
              >
                <MapIcon size={18} className="inline mr-1" /> Mapy
              </button>
              <button
                onClick={() => setActiveTab('tokens')}
                className={`flex-1 p-3 text-sm font-medium ${activeTab === 'tokens' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}
              >
                <Users size={18} className="inline mr-1" /> Postavy
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 p-3 text-sm font-medium ${activeTab === 'settings' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-zinc-500'}`}
              >
                <Settings size={18} className="inline mr-1" /> Nastavení
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'maps' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold">Výběr mapy</h3>
                    <button onClick={loadFiles} className="text-zinc-500 hover:text-white">
                      <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {maps.map(map => (
                      <button
                        key={map.path}
                        onClick={() => onMapSelect(map)}
                        className={`p-2 text-xs rounded border transition-all ${state.activeMapId === map.path ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-500'}`}
                      >
                        <div className="aspect-video bg-black rounded mb-1 overflow-hidden">
                          <img src={map.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="truncate block">{map.name}</span>
                      </button>
                    ))}
                  </div>
                  {state.activeMapId && (
                    <div className="pt-4 border-t border-zinc-800">
                      <button
                        onClick={() => onAddFogArea('rect')}
                        className="w-full mb-2 p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm flex items-center justify-center gap-2"
                      >
                        <Layers size={16} /> Přidat obdélník
                      </button>
                      <button
                        onClick={() => onAddFogArea('poly')}
                        className="w-full mb-2 p-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm flex items-center justify-center gap-2"
                      >
                        <Layers size={16} /> Přidat polygon
                      </button>
                      <button
                        onClick={() => onResetMap(state.activeMapId)}
                        className="w-full p-2 text-red-400 hover:bg-red-400/10 rounded text-sm flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} /> Resetovat mapu
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'tokens' && (
                <div className="space-y-4">
                  <h3 className="font-bold">Přidat postavu</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {characters.map(char => (
                      <button
                        key={char.path}
                        onClick={() => onAddToken(char)}
                        className="p-2 border border-zinc-700 hover:border-blue-500 rounded transition-all group"
                      >
                        <div className="aspect-square bg-black rounded-full mb-1 overflow-hidden border-2 border-transparent group-hover:border-blue-500">
                          <img src={char.url} className="w-full h-full object-cover" alt="" />
                        </div>
                        <span className="text-[10px] truncate block">{char.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  <h3 className="font-bold">GitHub Repozitář</h3>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 block">Vlastník (Owner)</label>
                    <input
                      type="text"
                      value={ghOwner}
                      onChange={(e) => setGhOwner(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm"
                      placeholder="např. jmeno-uzivatele"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 block">Repozitář (Repo)</label>
                    <input
                      type="text"
                      value={ghRepo}
                      onChange={(e) => setGhRepo(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-sm"
                      placeholder="např. dnd-mapy"
                    />
                  </div>
                  <button
                    onClick={handleSaveConfig}
                    className="w-full p-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-bold"
                  >
                    Uložit nastavení
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Minimal Icons for collapsed state */}
        {!isOpen && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <button onClick={() => {setIsOpen(true); setActiveTab('maps');}} className="text-zinc-500 hover:text-white"><MapIcon size={20} /></button>
            <button onClick={() => {setIsOpen(true); setActiveTab('tokens');}} className="text-zinc-500 hover:text-white"><Users size={20} /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
