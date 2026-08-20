import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight text-slate-900">
                Premium<span className="text-blue-600">Stays</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!loading && (
              user ? (
                <>
                  <span className="text-sm font-medium text-gray-500 hidden sm:block">
                    Hello, {user.name}
                  </span>

                  <Link 
                    to="/my-bookings" 
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    My Trips
                  </Link>

                  {user.role === 'host' && (
                    <Link 
                      to="/host/dashboard" 
                      className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Host Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    Sign up
                  </Link>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
