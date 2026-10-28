import L from 'leaflet';

// leaflet.markercluster expects a global `L`; this module must be evaluated before it.
window.L = L;
