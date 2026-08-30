import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import HotelDetails from './pages/HotelDetails';
import ProtectedRoute from './components/ProtectedRoute';
import HostDashboard from './pages/HostDashboard';
import MyBookings from './pages/MyBookings';
import PaymentSuccess from './pages/PaymentSuccess';
import Profile from './pages/Profile';
import EditHotel from './pages/EditHotel';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

const NotFound = () => (
  <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
    <p className="eyebrow">Error 404</p>
    <h1 className="mt-4 font-serif text-5xl font-semibold text-ink-900">
      This page has checked out.
    </h1>
    <p className="mt-3 max-w-md text-ink-500">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn-primary mt-8">Return home</Link>
  </div>
);

const Footer = () => (
  <footer className="mt-20 border-t border-ink-100">
    <div className="container-page flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-serif text-xl font-semibold text-ink-900">
          Premium<span className="text-brand-600">Stays</span>
        </p>
        <p className="mt-1 text-sm text-ink-400">
          Curated stays for the discerning traveller.
        </p>
      </div>
      <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-ink-500">
        <Link to="/" className="transition-colors hover:text-ink-900">Search stays</Link>
        <Link to="/my-bookings" className="transition-colors hover:text-ink-900">My trips</Link>
        <Link to="/host/dashboard" className="transition-colors hover:text-ink-900">Host a property</Link>
      </nav>
    </div>
    <p className="border-t border-ink-100 py-6 text-center text-xs text-ink-400">
      © {new Date().getFullYear()} PremiumStays. All rights reserved.
    </p>
  </footer>
);

function Layout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-brand-50">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <div key={location.pathname} className="animate-fade-up">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/hotels/:id" element={<HotelDetails />} />
            <Route
              path="/host/dashboard"
              element={
                <ProtectedRoute requiredRole="host">
                  <HostDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/edit/:id"
              element={
                <ProtectedRoute requiredRole="host">
                  <EditHotel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout />
      </Router>
    </AuthProvider>
  );
}

export default App;