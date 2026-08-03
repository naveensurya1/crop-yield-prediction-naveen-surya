import { useState, useEffect, useRef, useMemo } from "react";

import {
    getProfile,
    updateProfile,
    uploadProfilePhoto,
    changePassword
} from "../../services/farmerService";

import "../../styles/profile.css";

function UserIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
            <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 7l9 6 9-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function PhoneIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 3h3l2 5-2.5 1.5a11 11 0 005 5L15 12l5 2v3a2 2 0 01-2 2C10.5 19 5 13.5 5 6a2 2 0 011-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

function FarmIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 21V10l9-6 9 6v11" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M9 21v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}

function PinIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="12" cy="9" r="2.4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function RulerIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="8" width="18" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M7 8v3M11 8v3M15 8v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function LeafSmallIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C7 4 4 8 4 13c0 4.4 3.6 8 8 8s8-3.6 8-8c0-1-.2-2-.5-2.9C17.5 12 15 13 12 13V2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}

function LayersIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l9 5-9 5-9-5 9-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M3 13l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}

function DropletIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 3c4 5 7 8.5 7 12a7 7 0 01-14 0c0-3.5 3-7 7-12z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

function GlobeIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
            <path d="M3 12h18M12 3c2.5 2.5 3.8 6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-6-3.8-9s1.3-6.5 3.8-9z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg className="leading" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 10V7a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

function ChevronIcon() {
    return (
        <svg className="chevron" width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CameraIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <circle cx="12" cy="13.5" r="3.3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

const SOIL_TYPES = ["Alluvial", "Black", "Red", "Laterite", "Sandy", "Clay", "Loamy"];
const IRRIGATION_TYPES = ["Rain-fed", "Drip", "Canal", "Borewell", "Sprinkler"];
const LANGUAGES = ["English", "Telugu", "Hindi", "Tamil", "Kannada"];

function Field({ label, icon, hint, children }) {
    return (
        <div className="field">
            <label>{label}</label>
            <div className="field-input">
                {icon}
                {children}
            </div>
            {hint && <p className="field-hint">{hint}</p>}
        </div>
    );
}

function Profile() {

    const [loading, setLoading] = useState(true);

    const [savingPersonal, setSavingPersonal] = useState(false);
    const [savingFarm, setSavingFarm] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [photoPreview, setPhotoPreview] = useState(null);
    const fileInputRef = useRef(null);

    const [personal, setPersonal] = useState({
        full_name: "",
        email: "",
        phone: ""
    });

    const [farm, setFarm] = useState({
        farm_name: "",
        location: "",
        farm_area: "",
        primary_crops: "",
        soil_type: "",
        irrigation_type: "",
        experience_years: "",
        preferred_language: ""
    });

    const [passwords, setPasswords] = useState({
        current_password: "",
        new_password: "",
        confirm_password: ""
    });

    useEffect(() => {

        fetchProfile();

    }, []);

    const fetchProfile = async () => {

        try {

            const response = await getProfile();

            const data = response.data;

            setPersonal({
                full_name: data.full_name || "",
                email: data.email || "",
                phone: data.phone || ""
            });

            setFarm({
                farm_name: data.farm_name || "",
                location: data.location || "",
                farm_area: data.farm_area || "",
                primary_crops: data.primary_crops || "",
                soil_type: data.soil_type || "",
                irrigation_type: data.irrigation_type || "",
                experience_years: data.experience_years || "",
                preferred_language: data.preferred_language || ""
            });

            setPhotoPreview(data.photo_url || null);

        }
        catch (error) {

            console.log(error);

        }

        setLoading(false);

    };

    const completion = useMemo(() => {

        const fields = [
            personal.full_name,
            personal.phone,
            farm.farm_name,
            farm.location,
            farm.farm_area,
            farm.primary_crops,
            farm.soil_type,
            farm.irrigation_type
        ];

        const filled = fields.filter((value) => String(value).trim().length > 0).length;

        return Math.round((filled / fields.length) * 100);

    }, [personal, farm]);

    const handlePersonalChange = (e) => {

        setPersonal({
            ...personal,
            [e.target.name]: e.target.value
        });

    };

    const handleFarmChange = (e) => {

        setFarm({
            ...farm,
            [e.target.name]: e.target.value
        });

    };

    const handlePasswordChange = (e) => {

        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });

    };

    const handlePhotoClick = () => {

        fileInputRef.current?.click();

    };

    const handlePhotoChange = async (e) => {

        const file = e.target.files[0];

        if (!file)
            return;

        setPhotoPreview(URL.createObjectURL(file));

        try {

            await uploadProfilePhoto(file);

        }
        catch (error) {

            console.log(error);

            alert("Unable to upload photo. Please try again.");

        }

    };

    const savePersonal = async (e) => {

        e.preventDefault();

        setSavingPersonal(true);

        try {

            await updateProfile(personal);

            alert("Personal details updated.");

        }
        catch (error) {

            console.log(error);

            alert("Unable to save personal details.");

        }

        setSavingPersonal(false);

    };

    const saveFarm = async (e) => {

        e.preventDefault();

        setSavingFarm(true);

        try {

            await updateProfile(farm);

            alert("Farm details updated.");

        }
        catch (error) {

            console.log(error);

            alert("Unable to save farm details.");

        }

        setSavingFarm(false);

    };

    const savePassword = async (e) => {

        e.preventDefault();

        if (passwords.new_password !== passwords.confirm_password) {

            alert("New passwords do not match.");

            return;

        }

        setSavingPassword(true);

        try {

            await changePassword(passwords);

            alert("Password updated.");

            setPasswords({
                current_password: "",
                new_password: "",
                confirm_password: ""
            });

        }
        catch (error) {

            console.log(error);

            if (error.response) {

                alert(error.response.data.detail || "Unable to update password.");

            }
            else {

                alert("Unable to connect to server.");

            }

        }

        setSavingPassword(false);

    };

    if (loading) {

        return (
            <div className="profile-page">
                <p>Loading profile...</p>
            </div>
        );

    }

    const initials = personal.full_name
        ? personal.full_name.trim().split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase()
        : "?";

    return (
        <div className="profile-page">

            <div className="profile-header">
                <h1>Your profile</h1>
                <p>Keep your details current so predictions and recommendations stay accurate.</p>
            </div>

            <div className="completion-card">
                <span className="completion-label">
                    Profile <span>{completion}%</span> complete
                </span>
                <div className="completion-track">
                    <div className="completion-fill" style={{ width: `${completion}%` }} />
                </div>
            </div>

            <form className="profile-card" onSubmit={savePersonal}>

                <div className="profile-card-head">
                    <div>
                        <h2>Personal info</h2>
                        <p>Your name and contact details.</p>
                    </div>
                </div>

                <div className="avatar-row">

                    <div className="avatar-circle">
                        {photoPreview ? <img src={photoPreview} alt="Profile" /> : initials}
                    </div>

                    <button type="button" className="avatar-edit-btn" onClick={handlePhotoClick}>
                        <CameraIcon />
                        Change photo
                    </button>

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handlePhotoChange}
                        style={{ display: "none" }}
                    />

                </div>

                <div className="profile-grid">

                    <Field label="Full name" icon={<UserIcon />}>
                        <input
                            type="text"
                            name="full_name"
                            value={personal.full_name}
                            onChange={handlePersonalChange}
                        />
                    </Field>

                    <Field label="Phone number" icon={<PhoneIcon />}>
                        <input
                            type="tel"
                            name="phone"
                            value={personal.phone}
                            onChange={handlePersonalChange}
                        />
                    </Field>

                    <div className="field full-span">
                        <label>Email</label>
                        <div className="field-input">
                            <MailIcon />
                            <input
                                type="email"
                                name="email"
                                value={personal.email}
                                disabled
                            />
                        </div>
                        <p className="field-hint">Contact support to change your email address.</p>
                    </div>

                </div>

                <div className="profile-actions">
                    <button type="submit" className="save-btn" disabled={savingPersonal}>
                        {savingPersonal ? "Saving..." : "Save changes"}
                    </button>
                </div>

            </form>

            <form className="profile-card" onSubmit={saveFarm}>

                <div className="profile-card-head">
                    <div>
                        <h2>Farm details</h2>
                        <p>This powers your weather and yield predictions.</p>
                    </div>
                </div>

                <div className="profile-grid">

                    <Field label="Farm name" icon={<FarmIcon />}>
                        <input
                            type="text"
                            name="farm_name"
                            placeholder="e.g. Green Valley Farm"
                            value={farm.farm_name}
                            onChange={handleFarmChange}
                        />
                    </Field>

                    <Field label="Location" icon={<PinIcon />}>
                        <input
                            type="text"
                            name="location"
                            placeholder="Village, district, state"
                            value={farm.location}
                            onChange={handleFarmChange}
                        />
                    </Field>

                    <Field label="Total farm area (acres)" icon={<RulerIcon />}>
                        <input
                            type="number"
                            name="farm_area"
                            min="0"
                            step="0.1"
                            value={farm.farm_area}
                            onChange={handleFarmChange}
                        />
                    </Field>

                    <Field label="Primary crops" icon={<LeafSmallIcon />}>
                        <input
                            type="text"
                            name="primary_crops"
                            placeholder="e.g. Rice, cotton"
                            value={farm.primary_crops}
                            onChange={handleFarmChange}
                        />
                    </Field>

                    <Field label="Soil type" icon={<LayersIcon />}>
                        <select
                            name="soil_type"
                            value={farm.soil_type}
                            onChange={handleFarmChange}
                        >
                            <option value="">Select soil type</option>
                            {SOIL_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <ChevronIcon />
                    </Field>

                    <Field label="Irrigation type" icon={<DropletIcon />}>
                        <select
                            name="irrigation_type"
                            value={farm.irrigation_type}
                            onChange={handleFarmChange}
                        >
                            <option value="">Select irrigation type</option>
                            {IRRIGATION_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <ChevronIcon />
                    </Field>

                    <Field label="Years of farming experience" icon={<CalendarIcon />}>
                        <input
                            type="number"
                            name="experience_years"
                            min="0"
                            value={farm.experience_years}
                            onChange={handleFarmChange}
                        />
                    </Field>

                    <Field label="Preferred language" icon={<GlobeIcon />}>
                        <select
                            name="preferred_language"
                            value={farm.preferred_language}
                            onChange={handleFarmChange}
                        >
                            <option value="">Select language</option>
                            {LANGUAGES.map((lang) => (
                                <option key={lang} value={lang}>{lang}</option>
                            ))}
                        </select>
                        <ChevronIcon />
                    </Field>

                </div>

                <div className="profile-actions">
                    <button type="submit" className="save-btn" disabled={savingFarm}>
                        {savingFarm ? "Saving..." : "Save changes"}
                    </button>
                </div>

            </form>

            <form className="profile-card" onSubmit={savePassword}>

                <div className="profile-card-head">
                    <div>
                        <h2>Change password</h2>
                        <p>Choose a strong password you don't use elsewhere.</p>
                    </div>
                </div>

                <div className="profile-grid">

                    <div className="field full-span">
                        <label>Current password</label>
                        <div className="field-input">
                            <LockIcon />
                            <input
                                type="password"
                                name="current_password"
                                value={passwords.current_password}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>

                    <Field label="New password" icon={<LockIcon />}>
                        <input
                            type="password"
                            name="new_password"
                            value={passwords.new_password}
                            onChange={handlePasswordChange}
                        />
                    </Field>

                    <Field label="Confirm new password" icon={<LockIcon />}>
                        <input
                            type="password"
                            name="confirm_password"
                            value={passwords.confirm_password}
                            onChange={handlePasswordChange}
                        />
                    </Field>

                </div>

                <div className="profile-actions">
                    <button type="submit" className="save-btn" disabled={savingPassword}>
                        {savingPassword ? "Updating..." : "Update password"}
                    </button>
                </div>

            </form>

        </div>
    );

}

export default Profile;