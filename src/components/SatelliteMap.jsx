import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useGame } from '../context/GameContext';
import { LOCATIONS, OFFA_CENTER } from '../data/locations';
import { MapPin, Navigation, Compass, Layers, Eye, Sparkles } from 'lucide-react';

export const SatelliteMap = ({ onSelectLocation }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const playerMarkerRef = useRef(null);
  const tileLayerRef = useRef(null);

  const { player, travelTo } = useGame();
  const [mapMode, setMapMode] = useState('satellite'); // 'satellite' | 'streets' | 'topo'
  const [selectedPin, setSelectedPin] = useState(null);

  const TILE_PROVIDERS = {
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      name: 'High-Res Satellite'
    },
    streets: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
      name: 'Street Map'
    },
    topo: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap',
      name: 'Tactical Hybrid'
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: OFFA_CENTER,
        zoom: 14,
        minZoom: 12,
        maxZoom: 18,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      tileLayerRef.current = L.tileLayer(TILE_PROVIDERS.satellite.url, {
        attribution: TILE_PROVIDERS.satellite.attribution,
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Render / Update location pins
    LOCATIONS.forEach((loc) => {
      const isCurrent = loc.id === player.currentLocationId;

      const markerHtml = `
        <div class="relative group cursor-pointer flex items-center justify-center">
          <div class="w-8 h-8 rounded-full flex items-center justify-center shadow-xl border-2 transition-transform transform hover:scale-125 ${
            isCurrent
              ? 'bg-emerald-500 border-white text-slate-950 animate-bounce'
              : 'bg-slate-900/90 border-amber-400 text-amber-300'
          }">
            <span class="text-xs font-black">${isCurrent ? '★' : '📍'}</span>
          </div>
          ${
            isCurrent
              ? '<div class="absolute -inset-1 rounded-full bg-emerald-400 opacity-60 animate-ping"></div>'
              : ''
          }
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: markerHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      if (markersRef.current[loc.id]) {
        markersRef.current[loc.id].setIcon(icon);
      } else {
        const marker = L.marker(loc.coordinates, { icon }).addTo(map);
        marker.on('click', () => {
          setSelectedPin(loc);
          map.flyTo(loc.coordinates, 15, { duration: 1 });
        });
        markersRef.current[loc.id] = marker;
      }
    });

    return () => {
      // cleanup is handled on unmount
    };
  }, []);

  // Update map layer on mode change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const provider = TILE_PROVIDERS[mapMode];
    tileLayerRef.current.setUrl(provider.url);
  }, [mapMode]);

  // Center on current player position when currentLocationId changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const currentLoc = LOCATIONS.find((l) => l.id === player.currentLocationId);
    if (currentLoc) {
      setSelectedPin(currentLoc);
    }
  }, [player.currentLocationId]);

  const handleFocusLocation = (loc) => {
    setSelectedPin(loc);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(loc.coordinates, 16, { duration: 1.2 });
    }
  };

  const handleCenterOffa = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(OFFA_CENTER, 14, { duration: 1 });
    }
  };

  const currentLocObj = LOCATIONS.find((l) => l.id === player.currentLocationId);

  return (
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Top Left: Satellite HUD Overlay */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-400 font-bold">OFFASAT-1 LIVE RECON</span>
          <span className="text-slate-500">|</span>
          <span className="font-mono text-slate-300">8.1393° N, 4.7174° E</span>
        </div>

        {/* Current Location Badge */}
        {currentLocObj && (
          <div className="px-3 py-1.5 rounded-xl bg-emerald-950/90 backdrop-blur-md border border-emerald-600/40 text-xs shadow-lg flex items-center gap-2 text-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Current Station: <strong className="text-white">{currentLocObj.name}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Top Right: Layer Switcher & Re-center */}
      <div className="absolute top-3 right-3 z-[1000] flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800 shadow-lg pointer-events-auto">
        <button
          onClick={() => setMapMode('satellite')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
            mapMode === 'satellite'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>
        <button
          onClick={() => setMapMode('streets')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
            mapMode === 'streets'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Street</span>
        </button>
        <button
          onClick={handleCenterOffa}
          title="Center on Offa"
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <Compass className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Bottom Floating Landmark Details Card */}
      {selectedPin && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] sm:max-w-md mx-auto bg-slate-950/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 uppercase">
                  {selectedPin.category}
                </span>
                <span className="text-xs font-serif text-teal-300 italic">
                  {selectedPin.yorubaName}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">{selectedPin.name}</h3>
              <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{selectedPin.description}</p>
            </div>
            <button
              onClick={() => setSelectedPin(null)}
              className="text-slate-400 hover:text-white text-xs p-1"
            >
              ✕
            </button>
          </div>

          {/* Quick Amenities */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {selectedPin.amenities?.map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
              >
                {amenity}
              </span>
            ))}
          </div>

          {/* Action / Travel Bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            {player.currentLocationId === selectedPin.id ? (
              <div className="w-full flex items-center justify-between gap-2">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  You are here right now!
                </span>
                <button
                  onClick={() => onSelectLocation && onSelectLocation(selectedPin)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interact & Hustle</span>
                </button>
              </div>
            ) : (
              <div className="w-full flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 font-medium">Travel here:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => travelTo(selectedPin.id, 'trek')}
                    title="Trek on foot (Free, 15 Energy)"
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition"
                  >
                    🚶 Trek (Free)
                  </button>
                  <button
                    onClick={() => travelTo(selectedPin.id, 'okada')}
                    title="Take Okada (₦250, Fast)"
                    className="px-2.5 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs font-semibold border border-amber-700/60 transition"
                  >
                    🏍️ Okada (₦250)
                  </button>
                  <button
                    onClick={() => travelTo(selectedPin.id, 'keke')}
                    title="Take TVS Keke (₦150)"
                    className="px-2.5 py-1 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 text-xs font-semibold border border-teal-700/60 transition"
                  >
                    🛺 Keke (₦150)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
