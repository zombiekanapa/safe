import { MapPin, Download, BookOpen, AlertCircle, Phone, Database } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface SidebarProps {
  markers: ShelterMarker[];
  onMarkerClick: (marker: ShelterMarker) => void;
  onFindNearest: () => void;
  isDarkMode: boolean;
}

export function Sidebar({ markers, onMarkerClick, onFindNearest, isDarkMode }: SidebarProps) {
  const bgColor = isDarkMode ? 'bg-black border-[#333]' : 'bg-surface border-[#333]';
  const textColor = 'text-white';

  const seedDatabase = async () => {
    const MOCK_DATA = [
      { latitude: 53.4297, longitude: 14.5532, description: "CH KASKADA: Parking level -1. Reinforced concrete. Massive capacity.", status: "adminVerified", type: "undergroundParking", availability: "Business hours", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4328, longitude: 14.5583, description: "GALAXY CENTER: Deep underground parking -1/-2. High structural integrity.", status: "adminVerified", type: "undergroundParking", availability: "24/7", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4250, longitude: 14.5450, description: "BUNKIER GRUNWALDZKI: Civil Defense shelter. Historical depth 5m.", status: "officialGovernmentVerified", type: "shelter", availability: "Restricted", verifiedByGov: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4294, longitude: 14.5587, description: "FILHARMONIA: Underground parking -2. Massive modern reinforcement.", status: "adminVerified", type: "undergroundParking", availability: "Event based", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4187, longitude: 14.5505, description: "DWORZEC GŁÓWNY: Largest civilian nuclear-rated shelter. Platform tunnels.", status: "officialGovernmentVerified", type: "shelter", availability: "Emergency only", verifiedByGov: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4246, longitude: 14.5502, description: "POSEJDON CENTER: Modern deep parking -2/-3. High security core.", status: "adminVerified", type: "undergroundParking", availability: "24/7", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4312, longitude: 14.5651, description: "WAŁY CHROBREGO: Complex beneath Voivodeship Office. Tactical depth.", status: "officialGovernmentVerified", type: "shelter", availability: "Governmental", verifiedByGov: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4357, longitude: 14.5544, description: "HANZA TOWER DEEP: Modern skyscraper foundations. Levels -2/-3.", status: "adminVerified", type: "undergroundParking", availability: "Private/Public", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4225, longitude: 14.5365, description: "TURZYN PARKING: Underground lot -1. Immediate cover for market market.", status: "adminVerified", type: "undergroundParking", availability: "Business hours", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4278, longitude: 14.5512, description: "BLACK PEARL VAULT: Deep parking level. Reinforced commercial basement.", status: "adminVerified", type: "undergroundParking", availability: "Private access", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4245, longitude: 14.5518, description: "BRAMA PORTOWA SUB: Pedestrian tunnels. Immediate shrapnel protection.", status: "adminVerified", type: "subwayStation", availability: "24/7", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4318, longitude: 14.5552, description: "PLAC RODŁA SUB: Underground crossing linking Pazim/Galaxy.", status: "adminVerified", type: "subwayStation", availability: "24/7", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4265, longitude: 14.5605, description: "ZAMEK TUNNELS: Basements and historical tunnels under the castle.", status: "officialGovernmentVerified", type: "shelter", availability: "Restricted", verifiedByGov: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4335, longitude: 14.5482, description: "URZĄD MIASTA (OC-1): Official Civil Defense shelter. Rear courtyard.", status: "officialGovernmentVerified", type: "shelter", availability: "Emergency only", verifiedByGov: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4410, longitude: 14.5515, description: "MANHATTAN BASEMENT: Underground storage. Quick escape from market.", status: "adminVerified", type: "undergroundStore", availability: "Business hours", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4255, longitude: 14.5415, description: "JAGIELLOŃSKA REINFORCED: Luftschutz legacy basements. Deep & connected.", status: "adminVerified", type: "shelter", availability: "Private/Shared", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4330, longitude: 14.5525, description: "RAYSKIEGO VAULTS: Connected basement network. Thick masonry.", status: "adminVerified", type: "shelter", availability: "Private", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4242, longitude: 14.5540, description: "KINO PIONIER SUB: Oldest cinema basement. Reinforced substructure.", status: "adminVerified", type: "shelter", availability: "Business hours", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4282, longitude: 14.5422, description: "PLAC NOAKOWSKIEGO: Post-German air raid bunker. Structurally sound.", status: "adminVerified", type: "shelter", availability: "Abandoned", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4115, longitude: 14.5325, description: "PUM POMORZANY TUNNELS: Hospital tunnel network. High safety rating.", status: "officialGovernmentVerified", type: "shelter", availability: "Hospital staff/Patient", verifiedByGov: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4542, longitude: 14.5480, description: "SZPITAL ARKOŃSKA: Extensive underground corridor network.", status: "officialGovernmentVerified", type: "shelter", availability: "Medical only", verifiedByGov: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4215, longitude: 14.5802, description: "STARA RZEŹNIA VAULTS: Reinforced brick basements. Immediate cover.", status: "adminVerified", type: "undergroundStore", availability: "Commercial", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4240, longitude: 14.5780, description: "MCN TECHNICAL BASE: Underground technical deck. Modern concrete.", status: "adminVerified", type: "undergroundParking", availability: "Business hours", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4310, longitude: 14.5442, description: "UNIWERSYTET PIASTÓW: Massive basement laboratories and corridors.", status: "adminVerified", type: "shelter", availability: "Student/Staff", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4152, longitude: 14.5445, description: "CMENTARZ CENTRALNY: Large OC shelter near main gate. Bunker system.", status: "officialGovernmentVerified", type: "shelter", availability: "Emergency only", verifiedByGov: true, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4375, longitude: 14.5385, description: "NETTO ARENA STORAGE: Underground storage/technical levels.", status: "adminVerified", type: "undergroundStore", availability: "Event based", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4285, longitude: 14.5682, description: "PAZIM DEEP DECK: Underground service deck level -2. Mass shielding.", status: "adminVerified", type: "undergroundParking", availability: "Private/Staff", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4415, longitude: 14.5420, description: "KASPROWICZA BUNKERS: Historical shelters near Summer Theater.", status: "adminVerified", type: "shelter", availability: "Public park", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4250, longitude: 14.5580, description: "BULWAR PIASTOWSKI: Bridge foundations and service basements.", status: "adminVerified", type: "shelter", availability: "Riverside", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
      { latitude: 53.4212, longitude: 14.5425, description: "KRZYWOUSTEGO SHOPS: Deep commercial basements along main street.", status: "adminVerified", type: "undergroundStore", availability: "Business hours", verifiedByGov: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
    ];

    try {
      for (const item of MOCK_DATA) {
        await addDoc(collection(db, 'shelters'), item);
      }
      alert('Baza danych została zasilona 30 punktami bezpieczeństwa!');
    } catch (e) {
      console.error(e);
      alert('Błąd zasilania bazy. Sprawdź konsolę.');
    }
  };

  return (
    <aside className={`w-full lg:w-96 border-l-0 lg:border-l-2 p-8 ${bgColor} ${textColor} flex flex-col gap-10 overflow-y-auto h-full scrollbar-hidden`}>

      <section>
        <h1 className="text-6xl font-black text-accent tracking-tighter leading-[0.85] mb-2">
          EVACUATE!
        </h1>
        <p className="description text-xs font-bold leading-relaxed opacity-60 uppercase tracking-tight">
          Independent emergency management system for the city of Szczecin. Map data provided by Google Cloud.
        </p>
      </section>

      <section className="flex-1 overflow-hidden flex flex-col">
        <h2 className="text-[10px] font-black uppercase mb-4 tracking-[0.2em] opacity-40">
          Emergency Shelter List ({markers.length})
        </h2>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hidden">
          {markers.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-[#333] text-[10px] uppercase font-black opacity-30 text-center italic flex flex-col gap-4">
              <span>Baza danych jest pusta.</span>
              <span className="text-accent animate-pulse">Użyj żółtego przycisku "INITIALIZE" poniżej aby zasilić mapę.</span>
            </div>
          ) : (
            markers.map((marker, idx) => (
              <div 
                key={marker.id || idx} 
                onClick={() => onMarkerClick(marker)}
                className="shelter-card hover:border-accent group transition-all"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-black text-xs uppercase tracking-tight group-hover:text-accent">
                    {marker.description.split(':')[0]}
                  </span>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-sm ${marker.status === 'officialGovernmentVerified' ? 'bg-safe text-black' : 'bg-[#333] text-white'}`}>
                    {marker.status === 'officialGovernmentVerified' ? 'GOV' : 'ADMIN'}
                  </span>
                </div>
                <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest leading-normal line-clamp-2">
                  {marker.description.split(':')[1] || marker.type}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="p-1 bg-white">
          <button 
            onClick={seedDatabase}
            className="w-full bg-accent text-black font-black flex items-center justify-center gap-3 py-5 text-sm uppercase hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_#333] border-4 border-black"
          >
            <Database size={24} strokeWidth={3} />
            Initialize System Seed (30 Points)
          </button>
        </div>

        <button 
          onClick={onFindNearest}
          className="w-full emergency-btn flex items-center justify-center gap-3 py-4 text-base"
        >
          <AlertCircle size={20} />
          Locate Nearest Shelter
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button className="bg-surface border-2 border-[#333] p-3 text-[9px] font-black uppercase hover:border-accent">Protocols</button>
          <button className="bg-surface border-2 border-[#333] p-3 text-[9px] font-black uppercase hover:border-accent">Downloads</button>
        </div>
      </section>

      <footer className="pt-6 border-t border-[#333] font-mono text-[9px] uppercase tracking-wider opacity-40">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span>Signal: Stable</span>
            <span>Latency: 24ms</span>
          </div>
        </div>
      </footer>
    </aside>
  );
}

function DownloadItem({ title, version, type }: { title: string; version: string; type: string }) {
  return (
    <div className="flex items-center justify-between p-3 border border-current hover:bg-black hover:text-white transition-all cursor-pointer">
      <div>
        <p className="text-xs font-bold leading-tight uppercase">{title}</p>
        <p className="text-[9px] opacity-60 uppercase">{version} • {type}</p>
      </div>
      <Download size={16} />
    </div>
  );
}
