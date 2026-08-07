import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import FarmerLayout from "./layouts/FarmerLayout";
import Dashboard from "./pages/farmer/Dashboard";
import Predict from "./pages/farmer/Predict";
import Profile from "./pages/farmer/Profile";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
    return (
        <Routes>

            <Route path="/" element={<Login />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/farmer" element={<FarmerLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="predict" element={<Predict />} />
                <Route path="profile" element={<Profile />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
            </Route>

        </Routes>
    );
}

export default App;