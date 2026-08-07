import { useState, useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";
import { getProfile } from "../services/farmerService";

import {
    HomeIcon,
    SproutIcon,
    HistoryIcon,
    CloudIcon,
    CoinsIcon,
    UserIcon,
    HelpIcon,
    LogoutIcon,
    LeafIcon,
    SearchIcon,
    BellIcon,
    MenuIcon
} from "./FarmerIcons";

import "../styles/layout.css";

const NAV_ITEMS = [
    { to: "/farmer", label: "Dashboard", icon: <HomeIcon />, end: true },
    { to: "/farmer/predict", label: "Yield Prediction", icon: <SproutIcon /> },
    { to: "/farmer/history", label: "Prediction History", icon: <HistoryIcon /> },
    { to: "/farmer/weather", label: "Weather", icon: <CloudIcon /> },
    { to: "/farmer/market-prices", label: "Market Prices", icon: <CoinsIcon /> },
    { to: "/farmer/profile", label: "Profile", icon: <UserIcon /> },
    { to: "/farmer/help", label: "Help", icon: <HelpIcon /> }
];

function FarmerLayout() {

    const navigate = useNavigate();

    const { logout } = useContext(AuthContext);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [fullName, setFullName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {

        getProfile()
            .then((response) => {

                setFullName(response.data.full_name || "");
                setAvatarUrl(response.data.avatar_url || null);

            })
            .catch((error) => console.log(error));

    }, []);

    const handleLogout = () => {

        logout();

        navigate("/login");

    };

    const initials = fullName
        ? fullName.trim().split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()
        : "?";

    return (
        <div className="app-shell">

            <aside className={`sidebar ${sidebarOpen ? "is-open" : ""}`}>

                <div className="sidebar-logo">
                    <LeafIcon />
                    YieldSenseAI
                </div>

                <nav className="sidebar-nav">

                    {
                        NAV_ITEMS.map((item) => (

                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.end}
                                className={({ isActive }) => `sidebar-link ${isActive ? "is-active" : ""}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>

                        ))
                    }

                </nav>

                <div className="sidebar-divider" />

                <button className="sidebar-logout" onClick={handleLogout}>
                    <LogoutIcon />
                    Logout
                </button>

            </aside>

            <div className="app-main">

                <header className="navbar">

                    <button
                        className="navbar-menu-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle menu"
                    >
                        <MenuIcon />
                    </button>

                    <div className="navbar-search">
                        <SearchIcon />
                        <input type="text" placeholder="Search" />
                    </div>

                    <div className="navbar-right">

                        <button className="navbar-bell" aria-label="Notifications">
                            <BellIcon />
                            <span className="navbar-bell-dot" />
                        </button>

                        <div className="navbar-profile">

                            <div className="navbar-avatar">
                                {avatarUrl ? <img src={avatarUrl} alt="" /> : initials}
                            </div>

                            <span className="navbar-name">{fullName || "Farmer"}</span>

                        </div>

                    </div>

                </header>

                <main className="app-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );

}

export default FarmerLayout;