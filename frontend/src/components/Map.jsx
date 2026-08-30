import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icon not showing up in Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Map = ({ location, name }) => {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Convert the text location (e.g. "New York") to Lat/Lng coordinates
    const getCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
        );
        const data = await response.json();

        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      } finally {
        setLoading(false);
      }
    };

    if (location) getCoordinates();
  }, [location]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full animate-pulse items-center justify-center rounded-xl bg-ink-100 text-sm font-medium text-ink-400">
        Loading map…
      </div>
    );
  }

  if (!position) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-ink-100 bg-white text-sm text-ink-400">
        Map unavailable for this location.
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden relative z-0">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup className="font-serif font-semibold">
            {name}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
