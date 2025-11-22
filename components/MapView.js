import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function MapView({ posts, userLocation }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersLayer = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    // Default center (can be updated based on user location)
    const center = userLocation || { lat: 40.7128, lng: -74.0060 }; // NYC default

    mapInstance.current = L.map(mapContainer.current).setView(
      [center.lat, center.lng],
      13
    );

    // Add tile layer (using CartoDB Positron for clean look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Create markers layer
    markersLayer.current = L.layerGroup().addTo(mapInstance.current);

    // Add user location marker if available
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: '<div style="background: #1c1917; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstance.current)
        .bindPopup('<b>You are here</b>');
    }

    // Cleanup
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update center when user location changes
  useEffect(() => {
    if (mapInstance.current && userLocation) {
      mapInstance.current.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [userLocation]);

  // Update markers when posts change
  useEffect(() => {
    if (!markersLayer.current) return;

    // Clear existing markers
    markersLayer.current.clearLayers();

    // Add markers for each post
    posts.forEach(post => {
      if (!post.location) return;

      const markerColor = getCategoryColor(post.category);
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background: ${markerColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.2); cursor: pointer;"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([post.location.lat, post.location.lng], { icon });

      // Create popup content
      const popupContent = `
        <div style="min-width: 200px; max-width: 300px;">
          <div style="margin-bottom: 8px;">
            <span style="background: ${getCategoryBgColor(post.category)}; color: ${getCategoryTextColor(post.category)}; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">
              ${getCategoryLabel(post.category)}
            </span>
          </div>
          ${post.title ? `<h3 style="font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">${post.title}</h3>` : ''}
          <p style="font-size: 13px; color: #57534e; margin: 0 0 8px 0; line-height: 1.4;">
            ${truncate(post.description, 100)}
          </p>
          <div style="font-size: 12px; color: #78716c; margin-bottom: 8px;">
            Posted by ${post.authorName || 'Anonymous'} • ${formatRelativeTime(post.createdAt)}
          </div>
          <a href="/post/${post.id}" style="display: inline-block; background: #1c1917; color: white; padding: 6px 12px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 500;">
            View details
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.addTo(markersLayer.current);
    });

    // Fit bounds to show all markers
    if (posts.length > 0) {
      const bounds = posts
        .filter(post => post.location)
        .map(post => [post.location.lat, post.location.lng]);
      
      if (bounds.length > 0) {
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [posts]);

  return <div ref={mapContainer} className="w-full h-full" />;
}

// Helper functions
function getCategoryColor(category) {
  const colors = {
    safety: '#dc2626',
    'lost-pet': '#2563eb',
    event: '#16a34a',
    question: '#f59e0b',
    accessibility: '#9333ea',
    other: '#57534e',
  };
  return colors[category] || colors.other;
}

function getCategoryBgColor(category) {
  const colors = {
    safety: '#fef2f2',
    'lost-pet': '#eff6ff',
    event: '#f0fdf4',
    question: '#fffbeb',
    accessibility: '#faf5ff',
    other: '#fafaf9',
  };
  return colors[category] || colors.other;
}

function getCategoryTextColor(category) {
  const colors = {
    safety: '#991b1b',
    'lost-pet': '#1e40af',
    event: '#15803d',
    question: '#b45309',
    accessibility: '#6b21a8',
    other: '#44403c',
  };
  return colors[category] || colors.other;
}

function getCategoryLabel(category) {
  const labels = {
    safety: 'Safety',
    'lost-pet': 'Lost Pet',
    event: 'Event',
    question: 'Question',
    accessibility: 'Accessibility',
    other: 'Other',
  };
  return labels[category] || 'Other';
}

function truncate(str, length = 100) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

function formatRelativeTime(date) {
  if (!date) return '';
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 604800)}w ago`;
}
