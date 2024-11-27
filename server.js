import express from "express"
import cors from "cors"; // Add this import at the top

const app = express();
const port = 3001;

// Add CORS middleware here, right after creating the app
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true
}));

app.use(express.json());

let latestSensorData = {
  SoilTemp: 25,
  AirTemp: 22,
  Humidity: 60,
  SoilMoisture: 40,
  IdealSoilTemp: 23,
  IdealAirTemp: 21,
  IdealHumidity: 65,
  IdealSoilMoisture: 41
};

// Endpoint for NodeMCU to send data
app.post('/api/nodeMCU-data', (req, res) => {
  const { SoilTemp, AirTemp, Humidity, SoilMoisture } = req.body;
  
  // Update the latest sensor data
  latestSensorData = {
    ...latestSensorData,
    SoilTemp,
    AirTemp,
    Humidity,
    SoilMoisture
  };
  console.log('Received data from NodeMCU:', latestSensorData);
  res.status(200).json({ message: 'Data received successfully' });
});

// Endpoint for React app to get the latest sensor data
app.get('/api/sensor-data', (req, res) => { // Changed from POST to GET
  res.json(latestSensorData);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});