import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const navItemClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'
    }`;

  const mobileItemClass =
    'rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:bg-ink-50';

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100/70 bg-brand-50/85 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between lg:h-20">
        <Link
          to="/"
          className="font-serif text-[1.65rem] font-semibold tracking-tight text-ink-900"
        >
          Premium<span className="text-brand-600">Stays</span>
        </Link>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          className="rounded-lg border border-ink-200 p-2 text-ink-700 transition-colors hover:bg-white lg:hidden"
        >
          {open ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          {loading ? null : user ? (
            <>
              <NavLink to="/my-bookings" className={navItemClass}>My trips</NavLink>
              {user.role === 'host' && (
                <NavLink to="/host/dashboard" className={navItemClass}>Host dashboard</NavLink>
              )}
              <span className="h-6 w-px bg-ink-100" />
              <NavLink to="/profile" className="flex items-center gap-2.5 text-sm font-medium text-ink-600 transition-colors hover:text-ink-900">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-900 text-xs font-semibold text-white">
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </span>
                {user.name}
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-ink-600 transition-colors hover:text-ink-900"
              >
                Log in
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5">Sign up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {loading ? null : user ? (
              <>
                <Link to="/profile" className={mobileItemClass}>{user.name}</Link>
                <Link to="/my-bookings" className={mobileItemClass}>My trips</Link>
                {user.role === 'host' && (
                  <Link to="/host/dashboard" className={mobileItemClass}>Host dashboard</Link>
                )}
                <button onClick={handleLogout} className={`${mobileItemClass} text-left text-ink-500`}>
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={mobileItemClass}>Log in</Link>
                <Link to="/register" className="btn-primary mt-2">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;