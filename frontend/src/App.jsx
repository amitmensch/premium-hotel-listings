import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import HotelDetails from './pages/HotelDetails';
import ProtectedRoute from './components/ProtectedRoute';
import HostDashboard from './pages/HostDashboard';
import MyBookings from './pages/MyBookings';
import EditHotel from './pages/EditHotel';

const NotFound = () => <div className="p-8 text-center text-red-500 font-bold">404 - Page Not Found</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          {/* Footer Placeholder */}
          <footer className="bg-white border-t border-gray-200 py-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} PremiumStays. All rights reserved.
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
