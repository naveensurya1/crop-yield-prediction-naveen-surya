// AdminDashboard.jsx
// First page after admin login. Shows the four headline stats
// (Total Farmers, Predictions Today, Registered Crops, Weather Alerts)
// plus a recent-activity panel underneath.
//
// Data comes from GET /admin/dashboard/stats and /admin/dashboard/activity
// via the shared axios instance (lib/axios.js).
// Note: predictionsToday / registeredCrops / weatherAlerts currently come
// back as 0 from the backend until the Prediction/Crop/WeatherAlert models
// exist — see app/routers/admin.py.

import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { GrowthRing, SeedlingIcon, CloudAlertIcon } from '../../layouts/AdminIcons';

function getErrorMessage(err, fallback) {
  return (
    err?.response?.data?.detail ||
    err?.response?.data?.message ||
    err?.message ||
    fallback
  );
}

function StatCard({ label, value, delta, deltaTone }) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-ring"><GrowthRing /></div>
      <div className="admin-stat-label">{label}</div>
      <div className="admin-stat-value">{value}</div>
      {delta && <div className={`admin-stat-delta ${deltaTone || ''}`}>{delta}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  async function load() {
    setLoading(true);
    setLoadError('');
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/dashboard/activity'),
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
    } catch (err) {
      setLoadError(getErrorMessage(err, 'Could not load the dashboard.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const tagClass = (tag) => (tag === 'alert' ? 'alert' : tag === 'crop' ? 'crop' : '');

  if (loading) return <div className="admin-loading">Loading dashboard…</div>;

  if (loadError) {
    return (
      <div className="admin-empty">
        {loadError}
        <div style={{ marginTop: 12 }}>
          <button className="admin-select" style={{ cursor: 'pointer' }} onClick={load}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-stat-grid">
        <StatCard label="Total Farmers" value={stats.totalFarmers?.toLocaleString?.() ?? stats.totalFarmers} delta={stats.farmersDelta} deltaTone="up" />
        <StatCard label="Predictions Today" value={stats.predictionsToday} delta={stats.predictionsDelta} deltaTone="up" />
        <StatCard label="Registered Crops" value={stats.registeredCrops} delta={stats.cropsDelta} />
        <StatCard label="Weather Alerts" value={stats.weatherAlerts} delta={stats.alertsDelta} deltaTone={stats.weatherAlerts > 0 ? 'down' : ''} />
      </div>

      <div className="admin-panel">
        <div className="admin-panel-head">
          <div className="admin-panel-title">Recent activity</div>
        </div>
        <div className="admin-activity-list">
          {activity && activity.length > 0 ? (
            activity.map((item) => (
              <div className="admin-activity-row" key={item.id}>
                <span className={`admin-activity-tag ${tagClass(item.tag)}`}>
                  {item.tag === 'alert' ? <CloudAlertIcon /> : item.tag === 'crop' ? <SeedlingIcon /> : item.tag}
                </span>
                <span>{item.label}</span>
                <span className="admin-activity-time">{item.time}</span>
              </div>
            ))
          ) : (
            <div className="admin-empty">No recent activity yet.</div>
          )}
        </div>
      </div>
    </>
  );
}