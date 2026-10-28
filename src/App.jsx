import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import MapPage from './pages/MapPage';
import About from './pages/About';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import AdminGate from './pages/admin/AdminGate';
import Dashboard from './pages/admin/Dashboard';
import AdminListings from './pages/admin/AdminListings';
import ListingForm from './pages/admin/ListingForm';
import Inquiries from './pages/admin/Inquiries';
import AgentSettings from './pages/admin/AgentSettings';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="listings" element={<Listings />} />
        <Route path="property/:id" element={<PropertyDetail />} />
        <Route path="map" element={<MapPage />} />
        <Route path="about" element={<About />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin" element={<AdminGate />}>
        <Route index element={<Dashboard />} />
        <Route path="listings" element={<AdminListings />} />
        <Route path="listings/new" element={<ListingForm />} />
        <Route path="listings/:id" element={<ListingForm />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route path="agent" element={<AgentSettings />} />
      </Route>
    </Routes>
  );
}
