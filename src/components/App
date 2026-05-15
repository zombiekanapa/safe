/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MapComponent } from './components/MapComponent';
import { ShelterMarker } from './types';
import { Info, X, AlertTriangle } from 'lucide-react';
import { db } from './lib/firebase';
import { collection, onSnapshot, query, getDocFromServer, doc } from 'firebase/firestore';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedShelter, setSelectedShelter] = useState<ShelterMarker | null>(null);
  const [markers, setMarkers] = useState<ShelterMarker[]>([]);
  const [connectionError, setConnectionError] = useState(false);
  const [loading, setLoading] = useState(true);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Firestore connection check
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'system', 'connection-check'));
      } catch (error: any) {
        if (error.message?.includes('the client is offline') || error.message?.includes('Missing or insufficient permissions')) {
          // Perms error is 'expected' if the doc doesn't exist, but it shows we're connected to the service
          console.log("Firebase connected (checked perms/offline)");
        } else {
          console.error("Firebase connection error:", error);
        }
      }
    }
    testConnection();
  }, []);

  // Real-time markers fetching
  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, 'shelters'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ShelterMarker));
      setMarkers(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firestore listen error:", error);
      setConnectionError(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkerClick = useCallback((marker: ShelterMarker) => {
    setSelectedShelter(marker);
  }, []);

  const handleFindNearest = () => {
    // Simple nearest calculation for MVP
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        let nearest = markers[0];
        let minDist = Infinity;

        markers.forEach(m => {
          const dist = Math.sqrt(Math.pow(m.latitude - latitude, 2) + Math.pow(m.longitude - longitude, 2));
          if (dist < minDist) {
            minDist = dist;
            nearest = m;
          }
        });

        setSelectedShelter(nearest);
      });
    } else {
      alert("Geolokalizacja nie jest wspierana przez Twoją przeglądarkę.");
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isDarkMode ? 'high-contrast' : ''}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      
      {connectionError && (
        <div className="bg-red-600 text-white p-2 text-center text-[10px] font-bold uppercase flex items-center justify-center gap-2">
          <AlertTriangle size={14} />
          Błąd połączenia z bazą danych (Firestore). Sprawdź uprawnienia lub dostęp do sieci.
        </div>
      )}

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 relative">
          {loading ? (
            <div className="flex items-center justify-center h-full bg-zinc-100 font-bold uppercase animate-pulse">
              System Inicjalizacji...
            </div>
          ) : (
            <MapComponent 
              markers={markers} 
              center={{ lat: 53.4285, lng: 14.5528 }} // Szczecin Center
              zoom={14}
              onMarkerClick={handleMarkerClick}
            />
          )}
          
          {selectedShelter && (
            <div className={`absolute bottom-6 left-6 right-6 lg:right-auto lg:w-96 p-8 border-t-8 border-safe z-50 bg-black text-white shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300`}>
              <button 
                onClick={() => setSelectedShelter(null)}
                className="absolute top-2 right-2 p-1 hover:bg-zinc-800 rounded-full text-white/40"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${selectedShelter.status === 'officialGovernmentVerified' ? 'bg-safe shadow-[0_0_10px_rgba(0,255,102,0.5)]' : 'bg-accent shadow-[0_0_10px_rgba(255,215,0,0.5)]'}`}></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Shelter Data Active</span>
                </div>
                
                <div>
                  <h3 className="font-black uppercase text-2xl leading-[0.9] tracking-tighter mb-2">{selectedShelter.description}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[9px] font-black bg-white text-black px-2 py-0.5 uppercase tracking-tighter">
                      {selectedShelter.type}
                    </span>
                    {selectedShelter.verifiedByGov && (
                      <span className="text-[9px] font-black bg-safe text-black px-2 py-0.5 uppercase tracking-tighter">
                        CIVIL DEFENSE VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/10 text-[10px] font-black uppercase tracking-widest space-y-3">
                <p className="flex justify-between">
                  <span className="opacity-40">Availability:</span>
                  <span>{selectedShelter.availability}</span>
                </p>
                <p className="flex justify-between">
                  <span className="opacity-40">Condition:</span>
                  <span className="text-safe">{selectedShelter.status}</span>
                </p>
              </div>

              <button className="w-full mt-8 emergency-btn">
                Reroute to Safety
              </button>
            </div>
          )}
        </div>

        <Sidebar 
          markers={markers}
          onMarkerClick={handleMarkerClick}
          onFindNearest={handleFindNearest} 
          isDarkMode={isDarkMode} 
        />
      </main>

      <div className="bg-black text-[#666] border-t border-[#333] px-6 py-3 flex flex-col md:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest gap-4 z-20">
        <div className="flex gap-6 overflow-hidden max-w-full">
          <div className="animate-marquee whitespace-nowrap flex gap-10 text-accent italic">
            <span>Critical Alert: Emergency shelters active in Szczecin Region</span>
            <span>OSM Engine Status: Stable</span>
            <span>Check Protocols for evacuation guidelines</span>
          </div>
        </div>
        <div className="flex gap-6 shrink-0 bg-black/80 backdrop-blur-sm px-4">
          <span>Signal: <span className="text-safe">Stable</span></span>
          <span className="hidden sm:inline">Last Update: 2026-04-18</span>
          <span className="text-accent">szczecin-safepoint.pl</span>
        </div>
      </div>
    </div>
  );
}

