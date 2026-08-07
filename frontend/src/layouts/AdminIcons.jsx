// AdminIcons.jsx
// Small inline SVG icon set for the admin panel, kept dependency-free
// (same pattern as the existing AuthIcons.jsx).

export const LogoMark = () => (
  <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14" cy="14" r="12.5" stroke="#C99A3E" strokeWidth="1.4" opacity="0.55" />
    <circle cx="14" cy="14" r="8.5" stroke="#C99A3E" strokeWidth="1.4" opacity="0.8" />
    <circle cx="14" cy="14" r="3.4" fill="#C99A3E" />
  </svg>
);

export const GrowthRing = ({ color = '#C99A3E' }) => (
  <svg viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="24" r="26" stroke={color} strokeWidth="1.3" opacity="0.18" />
    <circle cx="60" cy="24" r="18" stroke={color} strokeWidth="1.3" opacity="0.28" />
    <circle cx="60" cy="24" r="10" stroke={color} strokeWidth="1.3" opacity="0.4" />
  </svg>
);

export const DashboardIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="2.5" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11" y="11" width="6.5" height="6.5" rx="1.4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const UsersIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.2" cy="6.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2.5 16c0-2.8 2.1-4.4 4.7-4.4s4.7 1.6 4.7 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="14.3" cy="6.8" r="2.1" stroke="currentColor" strokeWidth="1.5" opacity="0.75" />
    <path d="M13 11.9c2.1.2 3.7 1.6 3.7 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.75" />
  </svg>
);

export const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.7" cy="8.7" r="5.2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 16l-3.2-3.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const PlusIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const SeedlingIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 17.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 11c0-3.3-2.6-5.8-6-6 0 3.5 2.6 6 6 6z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 8.5c0-2.8 2.1-4.8 5-5 0 2.9-2.1 5-5 5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export const CloudAlertIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 14.5h8.2a3 3 0 000-6 4.5 4.5 0 00-8.6-1.2A3.4 3.4 0 006 14.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M10 9v2.3M10 13.2v.1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ChevronDownIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LogoutIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 17.5H4.2a1.2 1.2 0 01-1.2-1.2V3.7a1.2 1.2 0 011.2-1.2h3.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 14l4.5-4-4.5-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.3 10H7.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);