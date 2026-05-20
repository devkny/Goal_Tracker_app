import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const links = [
    { to: '/dashboard', label: 'Goals' },
    { to: '/journal', label: 'Journal' },
    { to: '/stats', label: 'Stats' },
  ];

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-logo">
        Goal<span>Flow</span>
      </Link>

      <div className="navbar-links">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className={`navbar-link ${location.pathname === l.to ? 'active' : ''}`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="navbar-right">
        <span className="navbar-user">{user?.name}</span>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
