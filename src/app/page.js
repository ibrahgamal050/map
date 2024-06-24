"use client"
// src/app/order-tracking/page.js
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the OrderMap component to avoid SSR issues with Leaflet
const OrderMap = dynamic(() => import('../components/OrderMap'), { ssr: false });

const OrderTracking = () => {
  const [orderLocation, setOrderLocation] = useState(null);

  useEffect(() => {
    // Mock API call to fetch order location
    const fetchOrderLocation = async () => {
      // Simulate an API call
      const location = await new Promise(resolve => {
        setTimeout(() => {
          resolve({ lat: 30.6116903, lon: 32.2987676}); // Example coordinates
        }, 20);
      });
      setOrderLocation(location);
    };

    fetchOrderLocation();
  }, []);

  return (
    <div>
      <h1>Order Tracking</h1>
      <OrderMap orderLocation={orderLocation} />
    </div>
  );
};

export default OrderTracking;
