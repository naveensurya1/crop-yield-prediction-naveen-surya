// AdminUsers.jsx
// Users management page: search, role filter, "Add Admin" action, and a
// table of Name / Email / Role / Status / Registered.
//
// Data comes straight from the backend — GET /admin/users via the shared
// axios instance (lib/axios.js). If the request fails we show an error
// state with a retry button rather than silently swapping in fake data,
// so what you see always reflects the database.

import { useEffect, useMemo, useState } from 'react';
import api from '../../api/axios';
import { SearchIcon, PlusIcon } from '../../layouts/AdminIcons';

const ROLE_LABEL = { admin: 'Admin', farmer: 'Farmer', agronomist: 'Agronomist' };

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function getErrorMessage(err, fallback) {
  return (
    err?.response?.data?.detail ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

function AddAdminModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/admin/users', {
        full_name: form.name,
        email: form.email,
        password: form.password,
        role: 'Admin',
      });
      onCreated(res.data);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not reach the server. Check the backend is running.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, marginBottom: 4 }}>Add admin</h3>
        <p style={{ fontSize: 13, color: 'var(--admin-text-muted)', marginBottom: 16 }}>
          Set a password for the new admin now — they can change it later.
        </p>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Full name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
            placeholder="e.g. Anjali Rao"
          />
          <label style={labelStyle}>Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
            placeholder="name@example.com"
          />
          <label style={labelStyle}>Password</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            style={inputStyle}
            placeholder="At least 8 characters"
            minLength={8}
          />
          <label style={labelStyle}>Confirm password</label>
          <input
            required
            type="password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            style={inputStyle}
            placeholder="Re-enter password"
            minLength={8}
          />
          {error && <div style={{ color: 'var(--admin-danger)', fontSize: 12.5, marginTop: 10 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button type="button" onClick={onClose} className="admin-select" style={{ flex: 1, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="admin-btn-primary" style={{ flex: 1, justifyContent: 'center', margin: 0 }}>
              {submitting ? 'Adding…' : 'Add admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed', inset: 0, background: 'rgba(22,52,42,0.35)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50,
};
const modalStyle = {
  background: '#fff', borderRadius: 12, padding: 24, width: 360,
  border: '1px solid var(--admin-border)',
};
const labelStyle = { display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--admin-text-muted)', marginBottom: 6, marginTop: 12 };
const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--admin-border)',
  fontSize: 13.5, fontFamily: 'var(--font-body)', outline: 'none',
};

export default function AdminUsers() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  async function loadUsers() {
    setLoading(true);
    setLoadError('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setUsers(null);
      setLoadError(getErrorMessage(err, 'Could not load users from the server.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => {
      const matchesQuery =
        !query ||
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase());
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      return matchesQuery && matchesRole;
    });
  }, [users, query, roleFilter]);

  function handleCreated(created) {
    setUsers((prev) => [created, ...(prev || [])]);
    setShowAddAdmin(false);
  }

  return (
    <>
      <div className="admin-toolbar">
        <div className="admin-search">
          <SearchIcon />
          <input
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select
          className="admin-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="farmer">Farmer</option>
          <option value="agronomist">Agronomist</option>
        </select>

        <button className="admin-btn-primary" onClick={() => setShowAddAdmin(true)}>
          <PlusIcon />
          Add admin
        </button>
      </div>

      <div className="admin-panel">
        {loading ? (
          <div className="admin-loading">Loading users…</div>
        ) : loadError ? (
          <div className="admin-empty">
            {loadError}
            <div style={{ marginTop: 12 }}>
              <button className="admin-select" style={{ cursor: 'pointer' }} onClick={loadUsers}>
                Retry
              </button>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No users match your search.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-user-initial">{initials(u.name)}</span>
                      {u.name}
                    </div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`admin-badge role-${u.role}`}>{ROLE_LABEL[u.role] || u.role}</span>
                  </td>
                  <td>
                    <span className={`admin-status ${u.status}`}>
                      <span className="admin-status-dot" />
                      {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
                    </span>
                  </td>
                  <td>{u.registered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddAdmin && (
        <AddAdminModal onClose={() => setShowAddAdmin(false)} onCreated={handleCreated} />
      )}
    </>
  );
}