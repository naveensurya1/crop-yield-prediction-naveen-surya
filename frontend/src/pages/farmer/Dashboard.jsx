import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { getProfile } from "../../services/farmerService";
import { getWeather } from "../../services/weatherService";
import { getMarketPrices } from "../../services/marketService";
import { getHistory } from "../../services/predictionService";

import { CloudIcon, SproutIcon, ArrowUpIcon, ArrowDownIcon, TipIcon } from "../../layouts/FarmerIcons";

import "../../styles/dashboard.css";

function Dashboard() {

    const [loading, setLoading] = useState(true);

    const [firstName, setFirstName] = useState("");
    const [weather, setWeather] = useState(null);
    const [prices, setPrices] = useState([]);
    const [lastPrediction, setLastPrediction] = useState(null);

    useEffect(() => {

        fetchAll();

    }, []);

    const fetchAll = async () => {

        try {

            const [profileRes, weatherRes, pricesRes, historyRes] = await Promise.allSettled([
                getProfile(),
                getWeather(),
                getMarketPrices(),
                getHistory()
            ]);

            if (profileRes.status === "fulfilled") {

                const name = profileRes.value.data.full_name || "";

                setFirstName(name.split(" ")[0] || "");

            }

            if (weatherRes.status === "fulfilled") {

                setWeather(weatherRes.value.data);

            }

            if (pricesRes.status === "fulfilled") {

                setPrices(pricesRes.value.data.slice(0, 4));

            }

            if (historyRes.status === "fulfilled" && historyRes.value.data.length > 0) {

                setLastPrediction(historyRes.value.data[0]);

            }

        }
        catch (error) {

            console.log(error);

        }

        setLoading(false);

    };

    if (loading) {

        return (
            <div className="dashboard-page">
                <p>Loading dashboard...</p>
            </div>
        );

    }

    return (
        <div className="dashboard-page">

            <div className="welcome-row">

                <div>
                    <h1>Welcome, {firstName || "Farmer"}</h1>
                    <p>Here's what's happening on your farm today.</p>
                </div>

                <Link to="/farmer/predict" className="quick-predict-btn">
                    <SproutIcon />
                    New Prediction
                </Link>

            </div>

            <div className="dash-grid">

                <div className="dash-card">

                    <div className="dash-card-head">
                        <h2>Today's Weather</h2>
                        <Link to="/farmer/weather" className="dash-card-link">Details</Link>
                    </div>

                    {
                        weather
                            ?
                            <div className="weather-hero">
                                <div className="weather-hero-icon">
                                    <CloudIcon />
                                </div>
                                <div>
                                    <div className="weather-hero-temp">{weather.temp}°C</div>
                                    <div className="weather-hero-cond">{weather.condition}</div>
                                </div>
                            </div>
                            :
                            <p className="empty-mini">Weather data unavailable.</p>
                    }

                </div>

                <div className="dash-card">

                    <div className="dash-card-head">
                        <h2>Recent Prediction</h2>
                        <Link to="/farmer/history" className="dash-card-link">View all</Link>
                    </div>

                    {
                        lastPrediction
                            ?
                            <div>
                                <div className="pred-crop">{lastPrediction.crop}</div>
                                <div className="pred-yield">{lastPrediction.predicted_yield} kg</div>
                                <div className="pred-date">{lastPrediction.date}</div>
                            </div>
                            :
                            <p className="empty-mini">No predictions yet — run your first one.</p>
                    }

                </div>

                <div className="dash-card">

                    <div className="dash-card-head">
                        <h2>Market Prices</h2>
                        <Link to="/farmer/market-prices" className="dash-card-link">View all</Link>
                    </div>

                    {
                        prices.length > 0
                            ?
                            prices.map((item) => (

                                <div className="market-row" key={item.crop}>
                                    <span className="market-crop">{item.crop}</span>
                                    <span className={`market-price ${item.change >= 0 ? "is-up" : "is-down"}`}>
                                        {item.change >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                                        ₹{item.price}
                                    </span>
                                </div>

                            ))
                            :
                            <p className="empty-mini">Price data unavailable.</p>
                    }

                </div>

                <div className="dash-card tip-card">

                    <div className="tip-card-icon">
                        <TipIcon />
                    </div>

                    <p className="tip-card-text">
                        {
                            lastPrediction?.recommendation
                                ||
                                "Run a prediction to get personalized recommendations for your next crop cycle."
                        }
                    </p>

                </div>

            </div>

        </div>
    );

}

export default Dashboard;