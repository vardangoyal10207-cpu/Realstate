import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from '../lib/leaflet';
import { escapeHtml, formatCompactPrice, formatPrice, sized } from '../utils/format';

export const propertyMarker = (p, variant) => ({
  id: p.id,
  lat: p.lat,
  lng: p.lng,
  label: formatCompactPrice(p.price, p.rental),
  title: p.title,
  variant: variant || (p.status === 'Sold' || p.status === 'Rented' ? 'sold' : 'navy'),
  popup: popupHtml(p),
});

function popupHtml(p) {
  return `
    <a data-nav href="/property/${escapeHtml(p.id)}" style="display:block;text-decoration:none;color:inherit">
      <img src="${escapeHtml(sized(p.images[0], 480))}" alt="" style="width:100%;height:130px;object-fit:cover;display:block" />
      <div style="padding:12px 14px 14px">
        <div style="font-family:'Playfair Display',serif;font-weight:600;font-size:20px;color:#0B1F3A">${escapeHtml(formatPrice(p.price, p.rental))}</div>
        <div style="font-weight:600;font-size:14px;color:#0B1F3A;margin-top:2px">${escapeHtml(p.title)}</div>
        <div style="font-size:12px;color:#475569;margin-top:2px">${escapeHtml(p.address)}</div>
        <div style="font-size:12px;color:#475569;margin-top:6px">${p.bedrooms ? `${p.bedrooms} bd · ` : ''}${p.bathrooms ? `${p.bathrooms} ba · ` : ''}${p.sqft ? `${Number(p.sqft).toLocaleString('en-CA')} sqft` : escapeHtml(p.type)}</div>
        <div style="margin-top:8px;font-size:12px;font-weight:600;color:#7A5C14">View details →</div>
      </div>
    </a>`;
}

const pinIcon = (m) =>
  L.divIcon({
    className: '',
    html: `<span class="price-pin ${m.variant === 'gold' ? 'gold' : m.variant === 'sold' ? 'sold' : ''}">${escapeHtml(m.label)}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -38],
  });

/**
 * Leaflet map (OpenStreetMap tiles, no API key).
 * - `markers`: price-label pins with popup cards
 * - `cluster`: group nearby pins
 * - `onPick`: turn the map into a click-to-place picker (admin form)
 */
export default function MapView({
  markers = [], center = [43.5890, -79.6441], zoom = 11, cluster = false, fit = true,
  picked = null, onPick = null, className = '', label = 'Map', scrollWheelZoom = true,
}) {
  const el = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const pickMarker = useRef(null);
  const onPickRef = useRef(onPick);
  const navigate = useNavigate();
  onPickRef.current = onPick;

  // init
  useEffect(() => {
    const m = L.map(el.current, { center, zoom, scrollWheelZoom, zoomControl: true });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(m);
    map.current = m;
    m.on('click', (e) => onPickRef.current?.({ lat: +e.latlng.lat.toFixed(6), lng: +e.latlng.lng.toFixed(6) }));
    const onClick = (e) => {
      const a = e.target.closest?.('a[data-nav]');
      if (a) { e.preventDefault(); navigate(a.getAttribute('href')); }
    };
    el.current.addEventListener('click', onClick);
    const node = el.current;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(node);
    return () => {
      ro.disconnect();
      node.removeEventListener('click', onClick);
      m.remove();
      map.current = null; layer.current = null; pickMarker.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // markers
  const key = markers.map((m) => `${m.id}:${m.lat}:${m.lng}:${m.label}:${m.variant}`).join('|');
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (layer.current) m.removeLayer(layer.current);
    const group = cluster ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 }) : L.layerGroup();
    markers.forEach((mk) => {
      const marker = L.marker([mk.lat, mk.lng], {
        icon: pinIcon(mk), title: mk.title, alt: mk.title, zIndexOffset: mk.variant === 'gold' ? 1000 : 0,
      });
      if (mk.popup) marker.bindPopup(mk.popup, { maxWidth: 260, minWidth: 240, autoPanPadding: [30, 30] });
      group.addLayer(marker);
    });
    group.addTo(m);
    layer.current = group;
    if (fit && markers.length) {
      const bounds = L.latLngBounds(markers.map((mk) => [mk.lat, mk.lng]));
      if (markers.length === 1) m.setView(bounds.getCenter(), Math.max(zoom, 14));
      else m.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, cluster]);

  // picker marker
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (pickMarker.current) { m.removeLayer(pickMarker.current); pickMarker.current = null; }
    if (picked && Number.isFinite(picked.lat) && Number.isFinite(picked.lng)) {
      pickMarker.current = L.marker([picked.lat, picked.lng], {
        icon: L.divIcon({ className: '', html: '<span class="price-pin gold">Listing</span>', iconSize: [0, 0] }),
        draggable: !!onPick,
        title: 'Selected listing location',
      }).addTo(m);
      pickMarker.current.on('dragend', (e) => {
        const ll = e.target.getLatLng();
        onPickRef.current?.({ lat: +ll.lat.toFixed(6), lng: +ll.lng.toFixed(6) });
      });
      if (onPick && !m.getBounds().contains([picked.lat, picked.lng])) m.setView([picked.lat, picked.lng]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked?.lat, picked?.lng]);

  return <div ref={el} role="region" aria-label={label} className={`min-h-[240px] ${className}`} />;
}
