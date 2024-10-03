import React, { useState, useEffect } from 'react';
import { Thermometer, Droplet, Wind, Sprout } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';
import './ChartStyles.css';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState({
    SoilTemp: [],
    AirTemp: [],
    Humidity: [],
    SoilMoisture: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensor-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSensorData(data);
        setError(null);

        // Update historical data
        setHistoricalData(prevData => {
          const newData = { ...prevData };
          Object.keys(newData).forEach(key => {
            if (data[key] !== undefined) {
              newData[key] = [...prevData[key], { time: new Date().toLocaleTimeString(), value: data[key] }].slice(-20);
            }
          });
          return newData;
        });
      } catch (error) {
        setError('Failed to fetch sensor data. Using placeholder values.');
        console.error('There was a problem with the fetch operation:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // Refresh every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const placeholderData = {
    SoilTemp: 25,
    AirTemp: 22,
    Humidity: 60,
    SoilMoisture: 40,
    IdealSoilTemp: 23,
    IdealAirTemp: 21,
    IdealHumidity: 65,
    IdealSoilMoisture: 45
  };

  const displayData = sensorData || placeholderData;

  const factors = [
    { name: 'Soil Temp', key: 'SoilTemp', icon: Thermometer, current: displayData.SoilTemp, ideal: displayData.IdealSoilTemp, unit: '°C', colorClass: 'yellow' },
    { name: 'Air Temp', key: 'AirTemp', icon: Wind, current: displayData.AirTemp, ideal: displayData.IdealAirTemp, unit: '°C', colorClass: 'blue' },
    { name: 'Humidity', key: 'Humidity', icon: Droplet, current: displayData.Humidity, ideal: displayData.IdealHumidity, unit: '%', colorClass: 'green' },
    { name: 'Soil Moisture', key: 'SoilMoisture', icon: Sprout, current: displayData.SoilMoisture, ideal: displayData.IdealSoilMoisture, unit: '%', colorClass: 'brown' },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1 className="dashboard-title">Plant Environment Dashboard</h1>
          
          {error && (
            <div className="error-notification">
              <p className="error-title">Note</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className="factors-grid">
            {factors.map((factor) => (
              <div key={factor.name} className="factor-card">
                <div className="factor-content">
                  <div className={`factor-icon ${factor.colorClass}`}>
                    <factor.icon className="icon" aria-hidden="true" />
                  </div>
                  <div className="factor-details">
                    <div className="factor-name">{factor.name}</div>
                    <div className="factor-values">
                      <span className="current-value">
                      {factor.current !== undefined ? factor.current.toFixed(1) + factor.unit : '-'}
                      </span>
                      <span className="ideal-value">
                        Ideal: {factor.ideal}{factor.unit}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="factor-chart" style={{ height: '200px', padding: '1rem' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={historicalData[factor.key]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{fontSize: 10}} />
                      <YAxis tick={{fontSize: 10}} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;