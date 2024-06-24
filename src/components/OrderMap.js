// src/components/OrderMap.js
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './customIcon.css'; // Import custom CSS

// Custom photo URLs
const orderPhotoUrl = '/ola.jpeg';
const userPhotoUrl = '/ibrahim.jpg'; // Replace with the actual path to your user photo

const createCustomIcon = (photoUrl) => {
  return L.divIcon({
    html: `<div class="custom-icon" style="background-image: url(${photoUrl});"></div>`,
    className: '', // Reset the default leaflet icon styles
    iconSize: [50, 50], // size of the icon
    iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
  });
};

const OrderMap = ({ orderLocation }) => {
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      // Initialize the map only if it hasn't been initialized yet
      mapRef.current = L.map('map').setView([51.505, -0.09], 13);

      // Set up the OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    // Add a marker for the order location if provided
    if (orderLocation) {
      const { lat, lon } = orderLocation;
      const customIcon = createCustomIcon(orderPhotoUrl); // Use the custom photo URL for order location
      L.marker([lat, lon], { icon: customIcon }).addTo(mapRef.current)
        .bindPopup('Order Location')
        .openPopup();

      // Center the map on the order location
      mapRef.current.setView([lat, lon], 13);
    }
  }, [orderLocation]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        const userLocation = [latitude, longitude];

        // Update or add the user marker position with a custom photo
        const userIcon = createCustomIcon(userPhotoUrl);
        if (userMarkerRef.current) {
          // If the user marker exists, update its position
          userMarkerRef.current.setLatLng(userLocation);
        } else {
          // If the user marker doesn't exist, create it
          userMarkerRef.current = L.marker(userLocation, { icon: userIcon }).addTo(mapRef.current)
            .bindPopup('You are here!')
            .openPopup();
        }
      }, error => {
        console.error("Error getting geolocation:", error);
      });

      // Cleanup function to stop watching the position when the component is unmounted
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
};

export default OrderMap;
