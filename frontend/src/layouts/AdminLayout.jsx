// AdminLayout.jsx
// Shared shell for every admin page: sidebar nav + topbar.
// Mirrors the FarmerLayout pattern — this is a route element with nested
// <Route> children rendered via <Outlet />, active link state and the
// topbar title/subtitle are derived from the current route automatically.

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../styles/admin.css';
import { LogoMark, DashboardIcon, UsersIcon, LogoutIcon } from './AdminIcons';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', to: '/admin', end: true, icon: DashboardIcon },
  { key: 'users', label: 'Users', to: '/admin/users', end: false, icon: UsersIcon },
];

// Maps the current pathname to a topbar title/subtitle. Add an entry here
// whenever a new admin route is added.
const PAGE_META = {
  '/admin': { title: 'Dashboard', subtitle: 'Overview of farmers, predictions and field conditions' },
  '/admin/users': { title: 'Users', subtitle: 'Manage farmer, agronomist and admin accounts' },
};

export default function AdminLayout({ adminName = 'Admin' }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const meta = PAGE_META[pathname] || { title: 'Admin', subtitle: '' };

  const initials = adminName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span className="admin-logo-mark"><LogoMark /></span>
          <span className="admin-logo-word">Yield<span>Sense</span></span>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(({ key, label, to, end, icon: Icon }) => (
            <NavLink
              key={key}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <div>Signed in as {adminName}</div>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            <LogoutIcon />
            Log out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <div className="admin-page-title">{meta.title}</div>
            {meta.subtitle && <div className="admin-page-sub">{meta.subtitle}</div>}
          </div>
          <div className="admin-avatar">{initials}</div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}