import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { validatePassword } from "../../utils/validators";
import { getRoles, registerUser } from "../../services/authService";
import { MailIcon, LockIcon, UserIcon, RoleIcon, ChevronIcon, EyeIcon, EyeOffIcon, CheckIcon, LeafIcon } from "./AuthIcons";
import "../../styles/auth.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
        role: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({});

    const [roles, setRoles] = useState([]);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    useEffect(() => {

        fetchRoles();

    }, []);

    const fetchRoles = async () => {

        try {

            const response = await getRoles();

            setRoles(response.data);

        }
        catch (error) {

            console.log(error);

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const newErrors = {};

        if (!formData.full_name.trim())
            newErrors.full_name = "Full name is required.";

        if (!formData.email.trim())
            newErrors.email = "Email is required.";

        const passwordErrors = validatePassword(formData.password);

        if (passwordErrors.length > 0)
            newErrors.password = passwordErrors;

        if (formData.password !== formData.confirm_password)
            newErrors.confirm_password = "Passwords do not match.";

        if (!formData.role)
            newErrors.role = "Please select a role.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0)
            return;

        setLoading(true);

        try {

            await registerUser({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            alert("Registration Successful!");

            navigate("/login");

        }
        catch (error) {

            console.log(error);

            if (error.response) {

                alert(error.response.data.detail || "Registration failed.");

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
                            Grow smarter with AI-driven insight
                        </div>

                        <p className="brand-sub">
                            Join farmers and agronomists using predictive analytics to plan every season.
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

                        <h2>Create your account</h2>

                        <p>Start planning your next season with data on your side.</p>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className={`field ${errors.full_name ? "has-error" : ""}`}>

                            <label>Full name</label>

                            <div className="field-input">

                                <UserIcon />

                                <input
                                    type="text"
                                    name="full_name"
                                    placeholder="Enter your full name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                />

                            </div>

                            {
                                errors.full_name &&
                                <span className="error-text">
                                    {errors.full_name}
                                </span>
                            }

                        </div>

                        <div className={`field ${errors.email ? "has-error" : ""}`}>

                            <label>Email</label>

                            <div className="field-input">

                                <MailIcon />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </div>

                            {
                                errors.email &&
                                <span className="error-text">
                                    {errors.email}
                                </span>
                            }

                        </div>

                        <div className={`field ${errors.password ? "has-error" : ""}`}>

                            <label>Password</label>

                            <div className="field-input has-toggle">

                                <LockIcon />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Create a password"
                                    value={formData.password}
                                    onChange={handleChange}
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

                            {
                                errors.password &&
                                <ul className="error-list">

                                    {
                                        errors.password.map((error, index) => (

                                            <li key={index}>
                                                {error}
                                            </li>

                                        ))
                                    }

                                </ul>
                            }

                        </div>

                        <div className={`field ${errors.confirm_password ? "has-error" : ""}`}>

                            <label>Confirm password</label>

                            <div className="field-input has-toggle">

                                <LockIcon />

                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirm_password"
                                    placeholder="Re-enter your password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                />

                                <button
                                    type="button"
                                    className="toggle-visibility"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>

                            </div>

                            {
                                errors.confirm_password &&
                                <span className="error-text">
                                    {errors.confirm_password}
                                </span>
                            }

                        </div>

                        <div className={`field ${errors.role ? "has-error" : ""}`}>

                            <label>Role</label>

                            <div className="field-input">

                                <RoleIcon />

                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
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

                            {
                                errors.role &&
                                <span className="error-text">
                                    {errors.role}
                                </span>
                            }

                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {
                                loading
                                    ?
                                    "Registering..."
                                    :
                                    "Register"
                            }
                        </button>

                    </form>

                    <p className="switch-line">

                        Already have an account?

                        <Link to="/login">
                            Login
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );

}

export default Register;