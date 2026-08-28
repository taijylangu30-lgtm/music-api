const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const config = require('./config');
const apiLimiter = require('./middleware/rateLimit');
const errorHandler = require('./middleware/errorHandler');

const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();

// Sécurité
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: config.allowedOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate Limiting sur les routes API
app.use('/api', apiLimiter);

// Serveur Static (Frontend Client & Admin)
app.use(express.static(path.join(__dirname, '../public')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

// Attachement des routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// Gestionnaire global d'erreurs
app.use(errorHandler);

module.exports = app;
