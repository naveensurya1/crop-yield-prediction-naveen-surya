import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, CheckIcon, LeafIcon } from "./AuthIcons";
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

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await loginUser(formData);

            // Save JWT & Role
            login(
                response.data.access_token,
                response.data.role
            );

            alert("Login Successful!");

            // Redirect according to role

            if (response.data.role === "Admin") {

                navigate("/admin");

            }
            else {

                navigate("/farmer");

            }

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

                    <p className="switch-line">

                        Don't have an account?

                        <Link to="/register">
                            Register
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );

}

export default Login;