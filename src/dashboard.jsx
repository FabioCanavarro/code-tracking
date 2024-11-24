import './dashboard.css';
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

  // Initialize with some sample data points
  useEffect(() => {
    const now = Date.now();
    const initialData = {
      SoilTemp: [],
      AirTemp: [],
      Humidity: [],
      SoilMoisture: []
    };

    // Create 10 data points for the last 10 minutes
    for (let i = 9; i >= 0; i--) {
      const time = now - (i * 60000); // Every minute
      const baseValues = {
        SoilTemp: 25 + Math.random() * 2 - 1,
        AirTemp: 22 + Math.random() * 2 - 1,
        Humidity: 60 + Math.random() * 4 - 2,
        SoilMoisture: 40 + Math.random() * 4 - 2
      };

      Object.keys(initialData).forEach(key => {
        initialData[key].push({
          time: time,
          value: baseValues[key],
          displayTime: new Date(time).toLocaleTimeString()
        });
      });
    }

    setHistoricalData(initialData);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sensor-data');
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
              // Add new data point
              const newPoint = {
                time: currentTime,
                value: data[key],
                displayTime: new Date().toLocaleTimeString()
              };

              // Keep only last 10 minutes of data
              const tenMinutesAgo = currentTime - (10 * 60 * 1000);
              const filteredData = prevData[key]
                .filter(point => point.time > tenMinutesAgo)
                .slice(-60); // Keep maximum 60 points

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

  const factors = [
    { 
      name: 'Soil Temp', 
      key: 'SoilTemp', 
      icon: Thermometer, 
      current: sensorData?.SoilTemp || 25, 
      ideal: sensorData?.IdealSoilTemp || 23, 
      unit: '°C', 
      colorClass: 'yellow',
      lineColor: '#f59e0b'
    },
    { 
      name: 'Air Temp', 
      key: 'AirTemp', 
      icon: Wind, 
      current: sensorData?.AirTemp || 22, 
      ideal: sensorData?.IdealAirTemp || 21, 
      unit: '°C', 
      colorClass: 'blue',
      lineColor: '#3b82f6'
    },
    { 
      name: 'Humidity', 
      key: 'Humidity', 
      icon: Droplet, 
      current: sensorData?.Humidity || 60, 
      ideal: sensorData?.IdealHumidity || 65, 
      unit: '%', 
      colorClass: 'green',
      lineColor: '#10b981'
    },
    { 
      name: 'Soil Moisture', 
      key: 'SoilMoisture', 
      icon: Sprout, 
      current: sensorData?.SoilMoisture || 40, 
      ideal: sensorData?.IdealSoilMoisture || 45, 
      unit: '%', 
      colorClass: 'brown',
      lineColor: '#8b4513'
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{new Date(label).toLocaleTimeString()}</p>
          <p className="tooltip-value">{`${payload[0].value.toFixed(1)}${payload[0].unit}`}</p>
        </div>
      );
    }
    return null;
  };

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
                        {factor.current.toFixed(1)}{factor.unit}
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
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#e5e7eb"
                      />
                      <XAxis 
                        dataKey="time" 
                        tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        stroke="#e5e7eb"
                      />
                      <YAxis 
                        domain={[
                          (dataMin) => Math.floor(dataMin * 0.9),
                          (dataMax) => Math.ceil(dataMax * 1.1)
                        ]}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        stroke="#e5e7eb"
                      />
                      <Tooltip content={<CustomTooltip unit={factor.unit} />} />
                      <ReferenceLine 
                        y={factor.ideal} 
                        stroke={factor.lineColor} 
                        strokeDasharray="3 3"
                        strokeWidth={2}
                        label={{ 
                          value: 'Ideal',
                          position: 'right',
                          fill: factor.lineColor,
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