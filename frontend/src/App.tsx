import { Navigate, Route, Routes } from 'react-router-dom';
import { PublicLayout } from './components/PublicLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { ListingPage } from './pages/ListingPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminAboutPage } from './pages/admin/AdminAboutPage';
import { AdminContactPage } from './pages/admin/AdminContactPage';
import { AdminTeamPage } from './pages/admin/AdminTeamPage';
import { AdminServicesPage } from './pages/admin/AdminServicesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminPropertiesPage } from './pages/admin/AdminPropertiesPage';
import { AdminPropertyFormPage } from './pages/admin/AdminPropertyFormPage';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="buy" element={<ListingPage transaction="BUY" />} />
        <Route path="buy/:category" element={<ListingPage transaction="BUY" />} />
        <Route path="rent" element={<ListingPage transaction="RENT" />} />
        <Route path="rent/:category" element={<ListingPage transaction="RENT" />} />
        <Route path="property/:id" element={<PropertyDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="about" element={<AdminAboutPage />} />
        <Route path="contact" element={<AdminContactPage />} />
        <Route path="team" element={<AdminTeamPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="buy" element={<AdminPropertiesPage transaction="BUY" />} />
        <Route path="buy/new" element={<AdminPropertyFormPage transaction="BUY" />} />
        <Route path="buy/:id" element={<AdminPropertyFormPage transaction="BUY" />} />
        <Route path="rent" element={<AdminPropertiesPage transaction="RENT" />} />
        <Route path="rent/new" element={<AdminPropertyFormPage transaction="RENT" />} />
        <Route path="rent/:id" element={<AdminPropertyFormPage transaction="RENT" />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
