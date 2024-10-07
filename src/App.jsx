import './App.css';
import './ChartStyles.css';
import React, { useState, useEffect } from 'react';
import { Thermometer, Droplet, Wind, Sprout } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState(null);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState({
    SoilTemp: [],
    AirTemp: [],
    Humidity: [],
    SoilMoisture: []
  });

  // Function to determine if a timestamp should be kept based on its age
  const shouldKeepTimestamp = (timestamp, latestTimestamp) => {
    const age = latestTimestamp - timestamp;
    const oneMinute = 60 * 1000;
    
    if (age < oneMinute) return true;
    if (age < 5 * oneMinute) return age % (5 * 1000) === 0;
    if (age < 10 * oneMinute) return age % (15 * 1000) === 0;
    return false;
  };

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

        const currentTime = Date.now();

        setHistoricalData(prevData => {
          const newData = { ...prevData };
          Object.keys(newData).forEach(key => {
            if (data[key] !== undefined) {
              const newPoint = {
                time: currentTime,
                value: data[key],
                displayTime: new Date().toLocaleTimeString()
              };

              const filteredData = prevData[key]
                .filter(point => shouldKeepTimestamp(point.time, currentTime));

              newData[key] = [...filteredData, newPoint];
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
    const interval = setInterval(fetchData, 2000);

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

  const formatXAxis = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false 
    });
  };

  // Custom tooltip formatter with 24-hour time
  const CustomTooltip = ({ active, payload, label, unit, idealValue }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{formatXAxis(label)}</p>
          <p className="tooltip-value">
            Current: {payload[0].value.toFixed(1)}{unit}
          </p>
          <p className="tooltip-ideal">
            Ideal: {idealValue}{unit}
          </p>
        </div>
      );
    }
    return null;
  };

  const factors = [
    { 
      name: 'Soil Temp', 
      key: 'SoilTemp', 
      icon: Thermometer, 
      current: displayData.SoilTemp, 
      ideal: displayData.IdealSoilTemp, 
      unit: '°C', 
      colorClass: 'yellow',
      yAxisRange: [0, 40],
      lineColor: '#f59e0b',
      idealLineColor: '#92400e'
    },
    { 
      name: 'Air Temp', 
      key: 'AirTemp', 
      icon: Wind, 
      current: displayData.AirTemp, 
      ideal: displayData.IdealAirTemp, 
      unit: '°C', 
      colorClass: 'blue',
      yAxisRange: [0, 50],
      lineColor: '#3b82f6',
      idealLineColor: '#1e40af'
    },
    { 
      name: 'Humidity', 
      key: 'Humidity', 
      icon: Droplet, 
      current: displayData.Humidity, 
      ideal: displayData.IdealHumidity, 
      unit: '%', 
      colorClass: 'green',
      yAxisRange: [0, 100],
      lineColor: '#10b981',
      idealLineColor: '#065f46'
    },
    { 
      name: 'Soil Moisture', 
      key: 'SoilMoisture', 
      icon: Sprout, 
      current: displayData.SoilMoisture, 
      ideal: displayData.IdealSoilMoisture, 
      unit: '%', 
      colorClass: 'brown',
      yAxisRange: [0, 100],
      lineColor: '#8b4513',
      idealLineColor: '#573214'
    },
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
                <div className="factor-chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart 
                      data={historicalData[factor.key]} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tickFormatter={formatXAxis}
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                      />
                      <YAxis 
                        domain={factor.yAxisRange}
                        tick={{ fontSize: 12 }}
                        tickCount={6}
                        label={{ 
                          value: factor.unit, 
                          angle: -90, 
                          position: 'insideLeft',
                          style: { textAnchor: 'middle' }
                        }}
                      />
                      <Tooltip 
                        content={<CustomTooltip 
                          unit={factor.unit} 
                          idealValue={factor.ideal}
                        />}
                      />
                      {/* Ideal value reference line */}
                      <ReferenceLine 
                        y={factor.ideal} 
                        stroke={factor.idealLineColor}
                        strokeDasharray="3 3"
                        strokeWidth={2}
                        label={{ 
                          value: 'Ideal',
                          position: 'right',
                          fill: factor.idealLineColor,
                          fontSize: 12
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke={factor.lineColor}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={300}
                      />
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