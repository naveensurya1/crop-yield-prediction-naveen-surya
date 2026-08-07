import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

import { AuthContext } from "../../context/AuthContext";
import { loginUser, googleLogin, completeGoogleSignup, getRoles } from "../../services/authService";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, CheckIcon, LeafIcon, RoleIcon, ChevronIcon } from "./Authicons";
import "../../styles/auth.css";

function Login() {

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const [googleLoading, setGoogleLoading] = useState(false);

    // Role-selection modal state, shown only for brand new Google sign-ins
    const [pendingGoogle, setPendingGoogle] = useState(null); // { credential, email, full_name }
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [completing, setCompleting] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const redirectByRole = (role) => {

        if (role === "Admin") {

            navigate("/admin");

        }
        else {

            navigate("/farmer");

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await loginUser(formData);

            login(
                response.data.access_token,
                response.data.role
            );

            alert("Login Successful!");

            redirectByRole(response.data.role);

        }
        catch (error) {

            console.log(error);

            if (error.response) {

                alert(error.response.data.detail);

            }
            else {

                alert("Unable to connect to server.");

            }

        }

        setLoading(false);

    };

    const handleGoogleSuccess = async (credentialResponse) => {

        setGoogleLoading(true);

        try {

            const response = await googleLogin(credentialResponse.credential);

            // Existing account — logs straight in
            if (response.data.access_token) {

                login(
                    response.data.access_token,
                    response.data.role
                );

                redirectByRole(response.data.role);

                setGoogleLoading(false);

                return;

            }

            // New account — collect a role before creating it
            const rolesResponse = await getRoles();

            setRoles(rolesResponse.data);

            setPendingGoogle({
                credential: credentialResponse.credential,
                email: response.data.email,
                full_name: response.data.full_name
            });

        }
        catch (error) {

            console.log(error);

            if (error.response) {

                alert(error.response.data.detail || "Google sign-in failed.");

            }
            else {

                alert("Unable to connect to server.");

            }

        }

        setGoogleLoading(false);

    };

    const handleCompleteGoogleSignup = async (e) => {

        e.preventDefault();

        if (!selectedRole) {

            alert("Please select a role.");

            return;

        }

        setCompleting(true);

        try {

            const response = await completeGoogleSignup(
                pendingGoogle.credential,
                selectedRole
            );

            login(
                response.data.access_token,
                response.data.role
            );

            setPendingGoogle(null);

            redirectByRole(response.data.role);

        }
        catch (error) {

            console.log(error);

            if (error.response) {

                alert(error.response.data.detail || "Unable to complete sign-up.");

            }
            else {

                alert("Unable to connect to server.");

            }

        }

        setCompleting(false);

    };

    return (
        <div className="auth-page">

            <div className="auth-shell">

                <div className="auth-brand">

                    <div className="brand-top">

                        <div className="brand-logo">
                            <LeafIcon />
                            YieldSenseAI
                        </div>

                        <div className="brand-tagline">
                            Welcome back to smarter farming
                        </div>

                        <p className="brand-sub">
                            Log in to track your fields, forecasts, and yield insights in one place.
                        </p>

                    </div>

                    <div className="brand-points">

                        <div className="brand-point">
                            <CheckIcon />
                            Real-time yield predictions
                        </div>

                        <div className="brand-point">
                            <CheckIcon />
                            Weather and soil intelligence
                        </div>

                        <div className="brand-point">
                            <CheckIcon />
                            Built for teams and cooperatives
                        </div>

                    </div>

                </div>

                <div className="auth-form-side">

                    <div className="form-head">

                        <h2>Log in to your account</h2>

                        <p>Enter your details to continue.</p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="field">

                            <label>Email</label>

                            <div className="field-input">

                                <MailIcon />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>

                        <div className="field">

                            <label>Password</label>

                            <div className="field-input has-toggle">

                                <LockIcon />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="toggle-visibility"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {
                                loading
                                    ?
                                    "Logging in..."
                                    :
                                    "Log in"
                            }
                        </button>

                    </form>

                    <div className="auth-divider">
                        <span>or continue with</span>
                    </div>

                    <div className="google-btn-wrap">

                        {
                            googleLoading
                                ?
                                <div className="google-btn-loading">Signing in...</div>
                                :
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => alert("Google sign-in failed.")}
                                    width="100%"
                                    text="continue_with"
                                    shape="rectangular"
                                />
                        }

                    </div>

                    <p className="switch-line">

                        Don't have an account?

                        <Link to="/register">
                            Register
                        </Link>

                    </p>

                </div>

            </div>

            {
                pendingGoogle &&

                <div className="modal-overlay">

                    <div className="modal-card">

                        <h3>Choose your role</h3>

                        <p className="modal-sub">
                            Signing up as <strong>{pendingGoogle.email}</strong>. Select how you'll use YieldSenseAI.
                        </p>

                        <form onSubmit={handleCompleteGoogleSignup}>

                            <div className="field">

                                <label>Role</label>

                                <div className="field-input">

                                    <RoleIcon />

                                    <select
                                        value={selectedRole}
                                        onChange={(e) => setSelectedRole(e.target.value)}
                                    >

                                        <option value="">Select your role</option>

                                        {
                                            roles.map((role) => (

                                                <option
                                                    key={role.role_id}
                                                    value={role.role_name}
                                                >
                                                    {role.role_name}
                                                </option>

                                            ))
                                        }

                                    </select>

                                    <ChevronIcon />

                                </div>

                            </div>

                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="modal-cancel-btn"
                                    onClick={() => setPendingGoogle(null)}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={completing}
                                >
                                    {completing ? "Creating account..." : "Continue"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            }

        </div>
    );

}

export default Login;