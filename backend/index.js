const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const summaryRoute = require("./routes/dashboard/summary");
const chartRoutes = require("./routes/dashboard/charts");
const historyRoutes = require('./routes/dashboard/history');
const assetRoutes = require('./routes/assets');
const disposalRoutes = require('./routes/disposals');
const assignmentRoutes = require("./routes/assignments");
const userRoutes = require("./routes/users");
const depreciationRoutes = require("./routes/depreciations");
const documentRoutes = require("./routes/documents");

// Konfigurasi environment
dotenv.config();

// Inisialisasi app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routing
app.use('/api', authRoutes);
app.use("/api/summary", summaryRoute);
app.use('/api/charts', chartRoutes);
app.use("/api/history", historyRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/disposals', disposalRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/depreciations", depreciationRoutes);
app.use("/api/documents", documentRoutes);
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.setHeader('Content-Disposition', 'inline');
    }
  }
}));

// Default route
app.get('/', (req, res) => {
  res.send('🚀 Fixed Asset Management Backend is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
