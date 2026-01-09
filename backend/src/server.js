const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/database'); // Import the database connection handler
const petRoutes = require('./routes/petRoutes');
const taskRoutes = require('./routes/taskRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const volunteerRoutes = require('./routes/volunteerRoutes'); // Import volunteer routes
const staffTaskRoutes = require('./routes/staffTaskRoutes'); // Import staff task routes
const activityLogRoutes = require('./routes/activityLogRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const staffRoutes = require('./routes/staffRoutes');

const app = express();
app.use(cors());
// Accept larger JSON payloads for base64 image uploads
app.use(express.json({ limit: '12mb' }));
// Also support URL-encoded form bodies at larger size
app.use(express.urlencoded({ limit: '12mb', extended: true }));


// --- API ROUTES ---

// Mount auth routes under the /api/auth prefix
app.use('/api/auth', authRoutes);

// Mount pet routes
app.use('/api/pets', petRoutes);

// Mount task routes
app.use('/api/tasks', taskRoutes);

// Mount application routes
app.use('/api/applications', applicationRoutes);

// Mount volunteer routes
app.use('/api/volunteers', volunteerRoutes);

// Mount staff task routes
app.use('/api/staff-tasks', staffTaskRoutes);

// Mount activity log routes
app.use('/api/activitylogs', activityLogRoutes);

// Mount medical record routes
app.use('/api/medical', medicalRecordRoutes);

// Mount staff routes
app.use('/api/staff', staffRoutes);

// Lightweight health endpoint to check server + DB status
app.get('/api/health', async (req, res) => {
  try {
    const conn = db.getConnectionStatus();
    const health = await db.healthCheck();
    res.json({
      server: 'ok',
      db: conn,
      dbHealth: health
    });
  } catch (err) {
    res.status(500).json({ error: 'health check failed', details: err.message });
  }
});

// Serve frontend static files so the backend can host the UI as well.
const path = require('path');
const frontendPath = path.resolve(__dirname, '..', '..', 'frontend');
app.use(express.static(frontendPath));

// If the request doesn't start with /api, serve the frontend's index.html
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await db.connect(); // Use your database class to connect
    const server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}
// Only start the server when this file is run directly
if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };