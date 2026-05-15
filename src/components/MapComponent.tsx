import { useEffect, useRef, useState, useMemo } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { ShelterMarker } from '../types';

interface MapProps {
  markers: ShelterMarker[];
  center: { lat: number; lng: number };
  zoom: number;
  onMarkerClick: (marker: ShelterMarker) => void;
}

const render = (status: Status) => {
  if (status === Status.LOADING) return <div className="flex items-center justify-center h-full bg-zinc-100 font-bold uppercase">Ładowanie Mapy...</div>;
  if (status === Status.FAILURE) return <div className="flex items-center justify-center h-full bg-red-50 text-red-500 font-bold p-8 text-center uppercase">Błąd Ładowania Mapy. Sprawdź Klucz API.</div>;
  return null;
};

export function MapComponent({ markers, center, zoom, onMarkerClick }: MapProps) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    return (
      <div className="map-container flex flex-col items-center justify-center p-8 text-center bg-black">
        <div className="bg-accent p-4 border-2 border-black mb-4">
          <p className="font-black uppercase text-sm text-black">Brak Klucza Google Maps</p>
        </div>
        <p className="text-xs font-black uppercase text-white/40 max-w-xs tracking-tighter">
          Dodaj klucz 'GOOGLE_MAPS_API_KEY' w panelu 'Secrets' aby aktywować mapę bezpieczeństwa.
        </p>
      </div>
    );
  }

  return (
    <div className="map-container w-full h-full min-h-[400px]">
      <Wrapper apiKey={apiKey} render={render}>
        <ActualMap 
          markers={markers} 
          center={center} 
          zoom={zoom} 
          onMarkerClick={onMarkerClick} 
        />
      </Wrapper>
    </div>
  );
}

function ActualMap({ markers, center, zoom, onMarkerClick }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          { "featureType": "all", "elementType": "labels.text.fill", "stylers": [{ "color": "#ffffff" }] },
          { "featureType": "all", "elementType": "labels.text.stroke", "stylers": [{ "visibility": "off" }] },
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#111111" }] },
          { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#1a1a1a" }] },
          { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffD700" }, { "weight": 0.5 }, { "lightness": -70 }] },
          { "featureType": "poi", "stylers": [{ "visibility": "off" }] }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map) {
      markers.forEach((data) => {
        const marker = new google.maps.Marker({
          position: { lat: data.latitude, lng: data.longitude },
          map,
          title: data.description,
          label: {
            text: '\u2622',
            color: 'black',
            fontSize: '14px',
            fontWeight: '900'
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: data.status === 'officialGovernmentVerified' ? '#00FF66' : '#FFD700',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#000',
            scale: 14
          }
        });

        marker.addListener('click', () => {
          onMarkerClick(data);
        });
      });
    }
  }, [map, markers, onMarkerClick]);

  return <div ref={ref} className="w-full h-full" />;
}
