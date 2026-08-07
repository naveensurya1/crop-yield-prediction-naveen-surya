import { useState } from "react";

import { predictYield } from "../../services/predictionService";
import { ChevronIcon } from "../../layouts/FarmerIcons";

import "../../styles/predict.css";

const CROPS = ["Rice", "Wheat", "Cotton", "Maize", "Sugarcane", "Millets", "Groundnut", "Tomato"];
const SOIL_TYPES = ["Black Soil", "Red Soil", "Clay", "Sandy", "Loamy", "Alluvial"];
const FERTILIZERS = ["Urea", "DAP", "NPK", "Organic", "Mixed"];

function Field({ label, children }) {
    return (
        <div className="field">
            <label>{label}</label>
            <div className="field-input">
                {children}
            </div>
        </div>
    );
}

function Predict() {

    const [formData, setFormData] = useState({
        state: "",
        district: "",
        crop: "",
        soil_type: "",
        area: "",
        area_unit: "Acres",
        rainfall: "",
        temperature: "",
        humidity: "",
        fertilizer: "",
        irrigation: ""
    });

    const [loading, setLoading] = useState(false);

    const [result, setResult] = useState(null);

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

            const response = await predictYield(formData);

            setResult(response.data);

        }
        catch (error) {

            console.log(error);

            if (error.response) {

                alert(error.response.data.detail || "Prediction failed.");

            }
            else {

                alert("Unable to connect to server.");

            }

        }

        setLoading(false);

    };

    const handleNewPrediction = () => {

        setResult(null);

    };

    const handleDownload = () => {

        window.print();

    };

    if (result) {

        const comparison = result.comparison || {};
        const maxCompare = Math.max(
            comparison.current || 0,
            comparison.previous || 0,
            comparison.district_avg || 0,
            1
        );

        return (
            <div className="predict-page">

                <div className="predict-header">
                    <h1>Prediction Result</h1>
                    <p>{formData.crop} · {formData.district || formData.state}</p>
                </div>

                <div className="result-hero">

                    <div className="result-stat-card">
                        <div className="result-stat-label">Predicted Yield</div>
                        <div className="result-stat-value">{result.predicted_yield} kg/hectare</div>
                    </div>

                    <div className="result-confidence-card">
                        <div className="result-stat-label" style={{ color: "#6b756f" }}>Confidence</div>
                        <div className="result-stat-value" style={{ color: "#161b18" }}>{result.confidence}%</div>
                        <div className="confidence-track">
                            <div className="confidence-fill" style={{ width: `${result.confidence}%` }} />
                        </div>
                    </div>

                </div>

                <div className="result-grid">

                    <div className="result-card">
                        <h3>AI Recommendation</h3>
                        <ul className="recommendation-list">
                            {
                                (result.recommendations || []).map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))
                            }
                        </ul>
                    </div>

                    <div className="result-card">
                        <h3>Overview</h3>
                        <div className="meta-row">
                            <span className="meta-label">Expected harvest</span>
                            <span className="meta-value">{result.expected_harvest || "--"}</span>
                        </div>
                        <div className="meta-row">
                            <span className="meta-label">Estimated profit</span>
                            <span className="meta-value">₹{result.estimated_profit ?? "--"}</span>
                        </div>
                        <div className="meta-row">
                            <span className="meta-label">Soil type</span>
                            <span className="meta-value">{formData.soil_type}</span>
                        </div>
                        <div className="meta-row">
                            <span className="meta-label">Area</span>
                            <span className="meta-value">{formData.area} {formData.area_unit}</span>
                        </div>
                    </div>

                    {
                        comparison.current !== undefined &&

                        <div className="result-card" style={{ gridColumn: "1 / -1" }}>

                            <h3>Yield Comparison</h3>

                            <div className="compare-item">
                                <div className="compare-label-row">
                                    <span>Current prediction</span>
                                    <span>{comparison.current} kg</span>
                                </div>
                                <div className="compare-track">
                                    <div
                                        className="compare-fill current"
                                        style={{ width: `${(comparison.current / maxCompare) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="compare-item">
                                <div className="compare-label-row">
                                    <span>Previous year</span>
                                    <span>{comparison.previous} kg</span>
                                </div>
                                <div className="compare-track">
                                    <div
                                        className="compare-fill previous"
                                        style={{ width: `${(comparison.previous / maxCompare) * 100}%` }}
                                    />
                                </div>
                            </div>

                            <div className="compare-item">
                                <div className="compare-label-row">
                                    <span>District average</span>
                                    <span>{comparison.district_avg} kg</span>
                                </div>
                                <div className="compare-track">
                                    <div
                                        className="compare-fill district"
                                        style={{ width: `${(comparison.district_avg / maxCompare) * 100}%` }}
                                    />
                                </div>
                            </div>

                        </div>
                    }

                </div>

                <div className="result-actions">
                    <button className="result-secondary-btn" onClick={handleDownload}>
                        Download report
                    </button>
                    <button className="result-new-btn" onClick={handleNewPrediction}>
                        New prediction
                    </button>
                </div>

            </div>
        );

    }

    return (
        <div className="predict-page">

            <div className="predict-header">
                <h1>Crop Yield Prediction</h1>
                <p>Enter your farm details to get an AI-powered yield estimate.</p>
            </div>

            <form className="predict-card" onSubmit={handleSubmit}>

                <div className="predict-section-title">Farm details</div>

                <div className="predict-grid">

                    <Field label="State">
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                    </Field>

                    <Field label="District">
                        <input
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                        />
                    </Field>

                    <div className="field">
                        <label>Area</label>
                        <div className="field-with-unit">
                            <input
                                type="number"
                                name="area"
                                min="0"
                                step="0.1"
                                value={formData.area}
                                onChange={handleChange}
                                required
                            />
                            <select
                                name="area_unit"
                                value={formData.area_unit}
                                onChange={handleChange}
                            >
                                <option value="Acres">Acres</option>
                                <option value="Hectares">Hectares</option>
                            </select>
                        </div>
                    </div>

                </div>

                <div className="predict-section-title">Crop &amp; soil</div>

                <div className="predict-grid">

                    <Field label="Crop">
                        <select
                            name="crop"
                            value={formData.crop}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select crop</option>
                            {CROPS.map((crop) => (
                                <option key={crop} value={crop}>{crop}</option>
                            ))}
                        </select>
                        <ChevronIcon />
                    </Field>

                    <Field label="Soil type">
                        <select
                            name="soil_type"
                            value={formData.soil_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select soil type</option>
                            {SOIL_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                        <ChevronIcon />
                    </Field>

                    <Field label="Fertilizer used">
                        <select
                            name="fertilizer"
                            value={formData.fertilizer}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select fertilizer</option>
                            {FERTILIZERS.map((item) => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                        <ChevronIcon />
                    </Field>

                </div>

                <div className="predict-section-title">Conditions</div>

                <div className="predict-grid">

                    <Field label="Rainfall (mm)">
                        <input
                            type="number"
                            name="rainfall"
                            min="0"
                            value={formData.rainfall}
                            onChange={handleChange}
                            required
                        />
                    </Field>

                    <Field label="Temperature (°C)">
                        <input
                            type="number"
                            name="temperature"
                            value={formData.temperature}
                            onChange={handleChange}
                            required
                        />
                    </Field>

                    <Field label="Humidity (%)">
                        <input
                            type="number"
                            name="humidity"
                            min="0"
                            max="100"
                            value={formData.humidity}
                            onChange={handleChange}
                            required
                        />
                    </Field>

                    <Field label="Irrigation">
                        <select
                            name="irrigation"
                            value={formData.irrigation}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        <ChevronIcon />
                    </Field>

                </div>

                <div className="predict-actions">
                    <button
                        type="submit"
                        className="predict-submit-btn"
                        disabled={loading}
                    >
                        {loading ? "Predicting..." : "Predict Yield"}
                    </button>
                </div>

            </form>

        </div>
    );

}

export default Predict;